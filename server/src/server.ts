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
  ServerSyncEvent
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
  // Sends track start event & sets timer to go to next song
  const handleSongStart = (
    nextSong: QueuedTrackData,
    prevSong?: QueuedTrackData
  ) => {
    const handleSongEnd = () => {
      const nextNextSong = queue.shift()
      if (nextNextSong) {
        handleSongStart(nextNextSong, nextSong)
      } else {
        // end playback
        currentTrack = null
      }
    }
    // send the queue change to the client
    const songStartEvent: SongStartEvent = {
      type: ServerSocketMessage.songStart,
      currentTrack: nextSong
    }
    currentTrack = nextSong
    ws.send(JSON.stringify(songStartEvent))
    setTimeout(handleSongEnd, nextSong.trackDurationS * 1000)
    if (prevSong) {
      history.push(prevSong)
    }
  }

  // Adds a track to the queue
  const handleQueueAdd = ({
    hash,
    trackId,
    trackDurationS
  }: ClientQueueRequestEvent) => {
    // TODO: do web 3 shit - verify hash here

    const startTime = new Date()
    const newUuid = uuid()
    const newSong = {
      hash,
      trackId,
      startTime,
      trackDurationS,
      uuid: newUuid
    }
    queue.push(newSong)
    if (!currentTrack) {
      handleSongStart(newSong)
    }
    // send the queue change to the client
    const queueChangeEvent: QueueChangeEvent = {
      type: ServerSocketMessage.queueChange,
      queue: [...queue, newSong],
      history: history
    }
    ws.send(JSON.stringify(queueChangeEvent))
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
