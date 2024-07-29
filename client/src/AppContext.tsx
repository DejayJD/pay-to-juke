import {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState
} from 'react'

import {
  ClientQueueRequestEvent,
  ClientSocketEvent,
  ClientSocketMessage
} from '../../types'

import { payForPlay } from './solana_dev'
import { TrackFull, PlayerTrackFull } from './types'
import { ReactionType } from './Reactions'
import { spawnReaction } from './Reactions/ReactionContainer'

// Define the initial state of the context
type AppContextState = {
  // Add your state properties here
  currentTrack: PlayerTrackFull | null
  currentTrackStartTime: Date | null
  queue: PlayerTrackFull[]
  queueHistory: PlayerTrackFull[]
  websocket: WebSocket | null
  audioPlayer: HTMLAudioElement | null
  volume: number
  addTrackToQueue: (track: TrackFull) => Promise<void>
  setCurrentTrack: (song: PlayerTrackFull | null) => void
  setCurrentTrackStartTime: (time: Date | null) => void
  setQueue: (queue: PlayerTrackFull[]) => void
  setQueueHistory: (queue: PlayerTrackFull[]) => void
  setWebsocket: (ws: WebSocket) => void
  setAudioPlayer: (audioPlayer: HTMLAudioElement) => void
  setVolume: (volume: number) => void
  spawnReaction: (type: ReactionType) => void
  sendReactionToServer: (type: ReactionType) => void
}

export const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [volume, setVolume] = useState(false)
  const [queue, setQueue] = useState<PlayerTrackFull[]>([])
  const [queueHistory, setQueueHistory] = useState<PlayerTrackFull[]>([])
  const [currentTrack, setCurrentTrack] = useState<PlayerTrackFull | null>(null)
  const [currentTrackStartTime, setCurrentTrackStartTime] =
    useState<Date | null>(null)

  const webSocketRef = useRef<WebSocket>(null)
  const audioPlayerRef = useRef<HTMLAudioElement>(null)

  const setAudioPlayer = useCallback((audioPlayer: HTMLAudioElement) => {
    // @ts-expect-error - too lazy to cast useRef to mutable ref type shit
    audioPlayerRef.current = audioPlayer
  }, [])

  const setWebsocket = useCallback((ws: WebSocket) => {
    // @ts-expect-error - too lazy to cast useRef to mutable ref type shit
    webSocketRef.current = ws
  }, [])

  const addTrackToQueue = async (track: TrackFull) => {
    try {
      await payForPlay()
    } catch (e) {
      console.error('payment failed', e)
      // alert('payment failed')
      // return
    }


    const transactionHash = 'oawdnaiowudnaowudn127893'
    // transaction is good to go now
    const queueChangeData: ClientQueueRequestEvent = {
      type: ClientSocketMessage.queueAddRequest,
      hash: transactionHash,
      trackId: track.id,
      trackDurationS: track.duration
    }

    // Send to the server
    if (webSocketRef?.current) {
      webSocketRef?.current.send(JSON.stringify(queueChangeData))
    }
  }

  const sendReactionToServer = (type: ReactionType) => {
    const message: ClientSocketEvent = {
      type: ClientSocketMessage.reaction,
      reactionType: type
    }
    webSocketRef.current?.send(JSON.stringify(message))
  }

  return (
    <AppContext.Provider
      value={{
        queue,
        setQueue,
        queueHistory,
        setQueueHistory,
        websocket: webSocketRef?.current,
        setWebsocket,
        addTrackToQueue,
        currentTrack,
        setCurrentTrack,
        audioPlayer: audioPlayerRef?.current,
        setAudioPlayer,
        currentTrackStartTime,
        setCurrentTrackStartTime,
        volume,
        setVolume,
        spawnReaction,
        sendReactionToServer
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
