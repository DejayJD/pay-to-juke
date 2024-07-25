import { createContext, PropsWithChildren, useState } from 'react'

import { TrackFull } from './types'

// Define the initial state of the context
type AppContextState = {
  // Add your state properties here
  playingQueue: TrackFull[]
  queueHistory: TrackFull[]
  setPlayingQueue: (queue: TrackFull[]) => void
  setQueueHistory: (queue: TrackFull[]) => void
}

export const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [playingQueue, setPlayingQueue] = useState<TrackFull[]>([])
  const [queueHistory, setQueueHistory] = useState<TrackFull[]>([])

  return (
    <AppContext.Provider
      value={{ playingQueue, setPlayingQueue, queueHistory, setQueueHistory }}
    >
      {children}
    </AppContext.Provider>
  )
}
