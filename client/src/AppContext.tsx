import { createContext, PropsWithChildren, useRef, useState } from 'react'

import { ClientQueueRequestEvent, ClientSocketMessage } from '../../types'

import { TrackFull } from './types'

// Define the initial state of the context
type AppContextState = {
  // Add your state properties here
  currentTrack: TrackFull | null
  queue: TrackFull[]
  queueHistory: TrackFull[]
  websocket: WebSocket | null
  addTrackToQueue: (track: TrackFull) => void
  setCurrentTrack: (song: TrackFull) => void
  setQueue: (queue: TrackFull[]) => void
  setQueueHistory: (queue: TrackFull[]) => void
  setWebsocket: (ws: WebSocket) => void
}

export const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [queue, setQueue] = useState<TrackFull[]>([])
  const [queueHistory, setQueueHistory] = useState<TrackFull[]>([])
  const [currentTrack, setCurrentTrack] = useState<TrackFull | null>(null)

  const webSocketRef = useRef<WebSocket>(null)

  const setWebsocket = (ws: WebSocket) => {
    // @ts-expect-error - too lazy to cast useRef to mutable ref type shit

    webSocketRef.current = ws
  }

  const addTrackToQueue = (track: TrackFull) => {
    // TODO: do dope web3 shit here

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
        setCurrentTrack
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
