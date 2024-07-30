import { Flex, ThemeProvider as HarmonyThemeProvider } from '@audius/harmony'

import { AppContextProvider } from './AppContext'
import { WebSocketListener } from './WebSocketListener'

import './App.css'
import { Visualizer } from './visualizer/Visualizer'
import { Playbar } from './Playbar'
import { PlayingQueue } from './PlayingQueue'
import { ReactionContainer } from './Reactions/ReactionContainer'
import { memo, useState } from 'react'
import { FullQueue } from './FullQueue'
import { Chat } from './Chat'
import { AuthLogin } from './AuthLogin'

const App = memo(
  () => {
    const [pastAuth, setPastAuth] = useState(false)

    const authRender = () => {
      return (
        <Flex
          w='100%'
          h='100%'
          alignItems='center'
          justifyContent='center'
          css={{ position: 'absolute' }}
        >
          <AuthLogin
            onLogin={() => {
              setPastAuth(true)
            }}
          />
        </Flex>
      )
    }

    return (
      <HarmonyThemeProvider theme='dark'>
        <AppContextProvider>
          {!pastAuth ? (
            authRender()
          ) : (
            <>
              <WebSocketListener />
              <Visualizer />
              <Playbar />
              <PlayingQueue />
              <ReactionContainer />
              <Chat />
              <FullQueue />
            </>
          )}
        </AppContextProvider>
      </HarmonyThemeProvider>
    )
  },
  () => false
)
export default App
