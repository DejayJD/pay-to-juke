import { memo, useContext, useEffect, useRef } from 'react'
import { AppContext } from './AppContext'
import {
  ClientChatEvent,
  ClientDisconnectEvent,
  ClientReactionEvent,
  ClientSocketMessage,
  ClientSyncRequestEvent,
  QueueChangeEvent,
  ServerSocketEvent,
  ServerSocketMessage,
  ServerSyncEvent,
  SongStartEvent
} from '../../types'
import { audiusSdk } from './audiusSdk'
import { PlayerTrackFull, TrackFull } from './types'
import { uniq } from 'lodash'
import { spawnReaction } from './Reactions/ReactionContainer'
import { ReactionType } from './Reactions'
import { User } from '@audius/sdk'

const LOCAL_WS_URL = 'ws://localhost:4001'
const SERVER_WS_URL = 'wss://jukeboxapi.audius.co'
const WS_URL = SERVER_WS_URL // swap this out to change to local dev

// Make the function wait until the connection is made...
function waitForFirstSocketConnection(socket: WebSocket, callback: () => void) {
  setTimeout(function () {
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

let socket: any

export const WebSocketListener = memo(
  () => {
    const trackCacheRef = useRef<Map<string, TrackFull>>(new Map())
    const {
      addChat,
      setQueue,
      setQueueHistory,
      setCurrentTrack,
      setCurrentTrackStartTime,
      websocket,
      setWebsocket,
      user,
      setListeners,
      setCurrentRequester
    } = useContext(AppContext)!

    // initialize the websocket connection and our queue listeners
    useEffect(
      () => {
        // need this so we dont react to rerenders
        if (websocket) return
        if (socket) return // hacky shit but works lol
        const ws = new WebSocket(WS_URL)
        socket = ws

        setWebsocket(ws)
        // Need to wait for the socket to connect then sync up with the server state
        waitForFirstSocketConnection(ws, () => {
          const initialSyncRequest: ClientSyncRequestEvent = {
            type: ClientSocketMessage.syncRequest,
            user
          }
          ws.send(JSON.stringify(initialSyncRequest))
        })

        const handleQueueChange = async ({
          queue,
          history
        }: QueueChangeEvent | ServerSyncEvent) => {
          console.log('QUEUE CHANGE EVENT', { queue, history })

          const unfetchedQueueTrackIds: string[] = queue
            .filter((track) => !trackCacheRef.current.has(track.trackId)) // filter already fetched tracks
            .map((track) => track.trackId) // map down to only track ids
          const dedupedQueueIds = uniq(unfetchedQueueTrackIds)

          const unfetchedHistoryTrackIds: string[] = history
            .filter((track) => !trackCacheRef.current.has(track.trackId)) // filter already fetched tracks
            .map((track) => track.trackId)
          const dedupedHistoryIds = uniq(unfetchedHistoryTrackIds)

          const allMissingTrackIds = uniq([
            ...dedupedHistoryIds,
            ...dedupedQueueIds
          ])

          // TODO: Should we return here?
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
            const track =
              trackCacheRef.current.get(queuedTrack.trackId) ??
              trackData.find((track) => track.id === queuedTrack.trackId)
            return {
              track: { ...track, uid: queuedTrack.uuid } as PlayerTrackFull,
              requester: queuedTrack.requester
            }
          })

          const clientHistoryData = history.map((queuedTrack) => {
            const track =
              trackCacheRef.current.get(queuedTrack.trackId) ??
              trackData.find((track) => track.id === queuedTrack.trackId)
            return {
              track: { ...track, uid: queuedTrack.uuid } as PlayerTrackFull,
              requester: queuedTrack.requester
            }
          })

          setQueue(clientQueueData)
          setQueueHistory(clientHistoryData)
        }

        const handleSongStart = async ({
          currentTrack
        }: SongStartEvent | ServerSyncEvent) => {
          console.log('SONG START EVENT', { currentTrack })
          if (currentTrack) {
            const { trackId, startTime, uuid, requester } = currentTrack

            setCurrentRequester(requester)
            if (trackCacheRef.current.has(trackId)) {
              setCurrentTrackStartTime(startTime)
              setCurrentTrack({
                ...(trackCacheRef.current.get(trackId) as TrackFull),
                uid: uuid
              })
            } else {
              const { data } = await audiusSdk.full.tracks.getTrack({ trackId })

              if (data) {
                setCurrentTrackStartTime(startTime)
                setCurrentTrack({
                  ...data,
                  uid: uuid
                })
              }
            }
          }
        }

        const handleReaction = (event: ClientReactionEvent) => {
          spawnReaction(event.reactionType as ReactionType)
        }

        const handleChat = (event: ClientChatEvent) => {
          addChat(event.msg, event.user)
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
          if (messageData.type === ServerSocketMessage.reaction) {
            // @ts-expect-error - just get it working
            handleReaction(messageData)
          }
          if (messageData.type === ServerSocketMessage.chat) {
            // @ts-expect-error - just get it working
            handleChat(messageData)
          }
          if (messageData.type === ServerSocketMessage.listenerChange) {
            console.log(messageData)
            setListeners(messageData.listeners as User[])
          }
        }

        ws.onmessage = socketMessageHandler
      },
      [
        // setQueue,
        // setQueueHistory,
        // setWebsocket,
        // setCurrentTrack,
        // websocket,
        // setCurrentTrackStartTime
      ]
    )

    useEffect(() => {
      function disconnectServer() {
        const disconnectEvent: ClientDisconnectEvent = {
          type: ClientSocketMessage.disconnect,
          user
        }
        socket.send(JSON.stringify(disconnectEvent))
      }
      window.onbeforeunload = function () {
        disconnectServer()
      }
      window.addEventListener('beforeunload', disconnectServer)
    }, [user])

    return null
  },
  () => false
)
