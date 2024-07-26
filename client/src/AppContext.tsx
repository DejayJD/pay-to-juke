import { createContext, PropsWithChildren, useRef, useState } from 'react'

import { ClientQueueRequestEvent, ClientSocketMessage } from '../../types'

import { payForPlay } from './solana_dev'
import { TrackFull, PlayerTrackFull } from './types'

// Define the initial state of the context
type AppContextState = {
  // Add your state properties here
  currentTrack: PlayerTrackFull | null
  currentTrackStartTime: Date | null
  queue: PlayerTrackFull[]
  queueHistory: PlayerTrackFull[]
  websocket: WebSocket | null
  addTrackToQueue: (track: TrackFull) => void
  setCurrentTrack: (song: PlayerTrackFull) => void
  setCurrentTrackStartTime: (time: Date | null) => void
  setQueue: (queue: PlayerTrackFull[]) => void
  setQueueHistory: (queue: PlayerTrackFull[]) => void
  setWebsocket: (ws: WebSocket) => void
}

export const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [queue, setQueue] = useState<PlayerTrackFull[]>([])
  const [queueHistory, setQueueHistory] = useState<PlayerTrackFull[]>([])
  const [currentTrack, setCurrentTrack] = useState<PlayerTrackFull | null>(null)
  const [currentTrackStartTime, setCurrentTrackStartTime] = useState<Date | null>(null)

  const webSocketRef = useRef<WebSocket>(null)

  const setWebsocket = (ws: WebSocket) => {
    // @ts-expect-error - too lazy to cast useRef to mutable ref type shit
    webSocketRef.current = ws
  }

  const addTrackToQueue = async (track: TrackFull) => {
    try {
      await payForPlay()
    } catch (e) {
      console.error('payment failed', e)
      alert('payment failed')
      return
    }

    // TODO: do dope web3 shit here

    const transactionHash = 'oawdnaiowudnaowudn127893'
    // transaction is good to go now
    const queueChangeData: ClientQueueRequestEvent = {
      type: ClientSocketMessage.queueAddRequest,
      hash: transactionHash,
      trackId: track.id,
      trackDurationS: track.duration,
    }

    // Send to the server
    if (webSocketRef?.current) {
      webSocketRef?.current.send(JSON.stringify(queueChangeData))
    }
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
        currentTrackStartTime,
        setCurrentTrackStartTime
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
