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
import { User } from '@audius/sdk'

type Chat = {
  user: string
  msg: string
}

type QueueData = { track: PlayerTrackFull; requester: User }

// Define the initial state of the context
type AppContextState = {
  // Add your state properties here
  currentTrack: PlayerTrackFull | null
  currentTrackStartTime: Date | null
  queue: QueueData[]
  queueHistory: QueueData[]
  chatHistory: Chat[]
  websocket: WebSocket | null
  audioPlayer: HTMLAudioElement | null
  volume: number
  addTrackToQueue: (track: TrackFull) => Promise<void>
  addChat: (msg: string, user: string) => void
  setCurrentTrack: (song: PlayerTrackFull | null) => void
  setCurrentTrackStartTime: (time: Date | null) => void
  setQueue: (queue: QueueData[]) => void
  setQueueHistory: (queue: QueueData[]) => void
  setWebsocket: (ws: WebSocket) => void
  setAudioPlayer: (audioPlayer: HTMLAudioElement) => void
  setVolume: (volume: number) => void
  spawnReaction: (type: ReactionType) => void
  sendReactionToServer: (type: ReactionType) => void
  sendChatToServer: (msg: string) => void
  user: User | null
  setUser: (user: User) => void
  listeners: User[]
  setListeners: (listeners: User[]) => void
  currentRequester: User | null
  setCurrentRequester: (u: User | null) => void
}

export const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [volume, setVolume] = useState(0.2)
  const [queue, setQueue] = useState<QueueData[]>([])
  const [queueHistory, setQueueHistory] = useState<QueueData[]>([])
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [currentTrack, setCurrentTrack] = useState<PlayerTrackFull | null>(null)
  const [currentTrackStartTime, setCurrentTrackStartTime] =
    useState<Date | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [currentRequester, setCurrentRequester] = useState<User | null>(null)
  const [listeners, setListeners] = useState<User[]>([])

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
      trackDurationS: track.duration,
      user
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

  const addChat = (msg: string, user: string) => {
    setChatHistory((history) => [...history, { user, msg }])
  }

  const sendChatToServer = (msg: string) => {
    const message: ClientSocketEvent = {
      type: ClientSocketMessage.chat,
      user: user?.handle || 'anon',
      msg
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
        chatHistory,
        addChat,
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
        sendReactionToServer,
        sendChatToServer,
        user,
        setUser,
        listeners,
        setListeners,
        currentRequester,
        setCurrentRequester
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
