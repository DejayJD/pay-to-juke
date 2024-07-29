import {
  Button,
  Flex,
  ThemeProvider as HarmonyThemeProvider,
  IconVolumeLevel3
} from '@audius/harmony'

import { AppContextProvider } from './AppContext'
import { WebSocketListener } from './WebSocketListener'

import './App.css'
import { Visualizer } from './visualizer/Visualizer'
import { Playbar } from './Playbar'
import { PlayingQueue } from './PlayingQueue'
import { ReactionContainer } from './Reactions/ReactionContainer'
import { memo, useState } from 'react'
import { FullQueue } from './FullQueue'

const App = memo(
  () => {
    const [showApp, setShowApp] = useState(false)
    if (!showApp) {
      return (
        <HarmonyThemeProvider theme='dark'>
          <Flex
            w='100%'
            h='100%'
            alignItems='center'
            justifyContent='center'
            css={{ position: 'absolute' }}
          >
            <Button
              iconRight={IconVolumeLevel3}
              onClick={() => setShowApp(true)}
            >
              Start listening
            </Button>
          </Flex>
        </HarmonyThemeProvider>
      )
    }
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
