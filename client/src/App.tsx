import { ThemeProvider as HarmonyThemeProvider } from '@audius/harmony'
import { Flex } from '@audius/harmony'

import { PlayingQueue } from './PlayingQueue'
import { TrackSearch } from './TrackSearch'
import { AppContextProvider } from './AppContext'
import { WebSocketListener } from './WebSocketListener'

import './App.css'
import { AudioPlayer } from './AudioPlayer'

export default function App() {
  // /**
  //  * Set the streamUrl for the audio player based on the clicked track
  //  */
  // const streamTrack = async (trackId: string) => {
  //   if (trackId === playingTrackId) {
  //     setIsPlaying((prev) => !prev)
  //   } else {
  //     setPlayingTrackSrc(await audiusSdk.tracks.streamTrack({ trackId }))
  //     setPlayingTrackId(trackId)
  //     setIsPlaying(true)
  //   }
  // }

  return (
    <HarmonyThemeProvider theme='dark'>
      <AppContextProvider>
        <WebSocketListener />
        <Flex direction='column' gap='m' m='2xl' alignItems='center'>
          <PlayingQueue />
          <AudioPlayer />
          <TrackSearch />
        </Flex>
      </AppContextProvider>
    </HarmonyThemeProvider>
  )
}
