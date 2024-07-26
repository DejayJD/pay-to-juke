import { createServer } from 'http'
import { Server as WebSocketServer } from 'ws'
import {
  ClientQueueRequestEvent,
  ClientSocketEvent,
  ClientSocketMessage,
  QueueChangeEvent,
  ServerSocketMessage,
  SongStartEvent,
  QueuedTrackData,
  ServerSyncEvent,
  EndPlaybackEvent
} from '../../types'
import { uuid } from './uuid'

const HOSTNAME = '127.0.0.1'
const REST_PORT = 4000
const WS_PORT = 4001

const queue: QueuedTrackData[] = []
const history: QueuedTrackData[] = []
let currentTrack: QueuedTrackData | null = null

// init web socket server
const wss = new WebSocketServer({
  port: WS_PORT
})

wss.on('connection', function connection(ws) {
  // Handle playing the next track in the queue
  const handlePlayNextTrack = () => {
    // If there is a current track, push into history
    if (currentTrack) history.push(currentTrack)

    // End playback if queue is empty
    if (queue.length === 0) return endPlayback()

    // Set current track to the next track in the queue
    const startTime = new Date()
    currentTrack = queue.shift() as QueuedTrackData
    currentTrack.startTime = startTime

    // Send events for song start and queue change
    const songStartEvent: SongStartEvent = {
      type: ServerSocketMessage.songStart,
      currentTrack
    }
    const queueChangeEvent: QueueChangeEvent = {
      type: ServerSocketMessage.queueChange,
      queue,
      history: history
    }
    ws.send(JSON.stringify(songStartEvent))
    ws.send(JSON.stringify(queueChangeEvent))

    // Start timer to play the next track
    setTimeout(handlePlayNextTrack, currentTrack.trackDurationS * 1000)
  }

  // Called when we reach the end of the play queue
  const endPlayback = () => {
    // TODO: Could also start playing from the recommended queue here
    currentTrack = null
    // Send end playback event to the client
    const endPlaybackEvent: EndPlaybackEvent = {
      type: ServerSocketMessage.endPlayback
    }
    ws.send(JSON.stringify(endPlaybackEvent))
  }

  // Adds a track to the queue
  const handleQueueAdd = ({
    hash,
    trackId,
    trackDurationS
  }: ClientQueueRequestEvent) => {
    // TODO: do web 3 shit - verify hash here

    const newUuid = uuid()
    const newTrack = {
      hash,
      trackId,
      trackDurationS,
      startTime: null,
      uuid: newUuid
    }
    queue.push(newTrack)

    if (!currentTrack) {
      handlePlayNextTrack()
    } else {
      // send the queue change to the client
      const queueChangeEvent: QueueChangeEvent = {
        type: ServerSocketMessage.queueChange,
        queue,
        history: history
      }
      ws.send(JSON.stringify(queueChangeEvent))
    }
  }

  const handleSyncRequest = () => {
    const syncEventData: ServerSyncEvent = {
      type: ServerSocketMessage.sync,
      queue,
      history,
      currentTrack
    }
    ws.send(JSON.stringify(syncEventData))
  }

  ws.on('message', function message(message: any) {
    const data: ClientSocketEvent = JSON.parse(message)
    console.log('received message! type:', data.type)
    if (data.type === ClientSocketMessage.queueAddRequest) {
      handleQueueAdd(data)
    }
    if (data.type === ClientSocketMessage.syncRequest) {
      handleSyncRequest()
    }
  })

  ws.on('error', console.error)
})

// REST server is just for checking if the server is working
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Server is running :)')
})

server.listen(REST_PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${REST_PORT}/`)
})
