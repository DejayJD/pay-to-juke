import { useContext, useEffect, useRef } from 'react'
import { AppContext } from './AppContext'
import {
  ClientSocketMessage,
  ClientSyncRequestEvent,
  QueueChangeEvent,
  ServerSocketEvent,
  ServerSocketMessage,
  ServerSyncEvent,
  SongStartEvent
} from '../../types'
import { audiusSdk } from './audiusSdk'
import { TrackFull } from './types'
import { uniq } from 'lodash'

const LOCAL_WS_URL = 'ws://localhost:4001'

// Make the function wait until the connection is made...
function waitForFirstSocketConnection(socket: WebSocket, callback: () => void) {
  setTimeout(function() {
    if (socket.readyState === 1) {
      if (callback != null) {
        callback()
      }
    } else {
      console.debug('waiting for socket connection...')
      waitForFirstSocketConnection(socket, callback)
    }
  }, 5) // wait 5 milisecond for the connection...
}

export const WebSocketListener = () => {
  const trackLoadStatusRef = useRef<Map<any, any>>(new Map())
  const {
    setQueue,
    setQueueHistory,
    setCurrentTrack,
    websocket,
    setWebsocket
  } = useContext(AppContext)!

  // initialize the websocket connection and our queue listeners
  useEffect(() => {
    // need this so we dont react to rerenders
    if (websocket) return
    const ws = new WebSocket(LOCAL_WS_URL)

    setWebsocket(ws)
    // Need to wait for the socket to connect then sync up with the server state
    waitForFirstSocketConnection(ws, () => {
      const initialSyncRequest: ClientSyncRequestEvent = {
        type: ClientSocketMessage.syncRequest
      }
      ws.send(JSON.stringify(initialSyncRequest))
    })

    const handleQueueChange = async ({
      queue,
      history
    }: QueueChangeEvent | ServerSyncEvent) => {
      console.log('QUEUE CHANGE EVENT', { queue, history })
      const unfetchedQueueTrackIds: string[] = queue
        .filter((track) => !trackLoadStatusRef.current.has(track.trackId)) // filter already fetched tracks
        .map((track) => track.trackId) // map down to only track ids
      const dedupedQueueIds = uniq(unfetchedQueueTrackIds)
      const unfetchedHistoryTrackIds: string[] = history
        .filter((track) => !trackLoadStatusRef.current.has(track.trackId)) // filter already fetched tracks
        .map((track) => track.trackId)
      const dedupedHistoryIds = uniq(unfetchedHistoryTrackIds)

      const allMissingTrackIds = [...dedupedHistoryIds, ...dedupedQueueIds]

      if (allMissingTrackIds.length === 0) return

      const missingTrackData = await audiusSdk.full.tracks.getBulkTracks({
        id: allMissingTrackIds
      })
      const trackData: TrackFull[] | undefined = missingTrackData.data
      if (!trackData) {
        console.error('Failed to fetch track data')
        return
      }

      const clientQueueData = queue.map((queuedTrack) => {
        const track = trackData.find(
          (track) => track.id === queuedTrack.trackId
        )
        return track as TrackFull
      })
      const clientHistoryData = history.map((queuedTrack) => {
        const track = trackData.find(
          (track) => track.id === queuedTrack.trackId
        )
        return track as TrackFull
      })
      setQueue(clientQueueData)
      setQueueHistory(clientHistoryData)
    }

    const handleSongStart = async ({
      currentTrack
    }: SongStartEvent | ServerSyncEvent) => {
      console.log('SONG START EVENT', { currentTrack })
      if (currentTrack) {
        const { trackId } = currentTrack
        const fullTrackData = await audiusSdk.full.tracks.getTrack({ trackId })

        if (fullTrackData.data) {
          setCurrentTrack(fullTrackData.data)
        }
      }
    }

    const handleSyncResponse = async (event: ServerSyncEvent) => {
      handleQueueChange(event)
      handleSongStart(event)
    }

    const socketMessageHandler = (event: MessageEvent) => {
      const messageData: ServerSocketEvent = JSON.parse(event.data)
      if (messageData.type === ServerSocketMessage.queueChange) {
        handleQueueChange(messageData)
      }
      if (messageData.type === ServerSocketMessage.songStart) {
        handleSongStart(messageData)
      }
      if (messageData.type === ServerSocketMessage.sync) {
        handleSyncResponse(messageData)
      }
    }

    ws.onmessage = socketMessageHandler
  }, [setQueue, setQueueHistory, setWebsocket, setCurrentTrack, websocket])

  return null
}
