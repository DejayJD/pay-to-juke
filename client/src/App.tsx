import { ThemeProvider as HarmonyThemeProvider } from '@audius/harmony'

import { AppContextProvider } from './AppContext'
import { WebSocketListener } from './WebSocketListener'

import './App.css'
import { Visualizer } from './visualizer/Visualizer'
import { Playbar } from './Playbar'
import { PlayingQueue } from './PlayingQueue'
import { ReactionContainer } from './Reactions/ReactionContainer'
import { memo } from 'react'
import { FullQueue } from './FullQueue'

const App = memo(
  () => {
    return (
      <HarmonyThemeProvider theme='dark'>
        <AppContextProvider>
          <WebSocketListener />
          <Visualizer />
          <Playbar />
          <PlayingQueue />
          <ReactionContainer />
          <FullQueue />
        </AppContextProvider>
      </HarmonyThemeProvider>
    )
  },
  () => false
)
export default App
