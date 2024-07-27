import { ThemeProvider as HarmonyThemeProvider } from '@audius/harmony'

import { AppContextProvider } from './AppContext'
import { WebSocketListener } from './WebSocketListener'

import './App.css'
import { AudioPlayer } from './AudioPlayer'
import { Visualizer } from './visualizer/Visualizer'
import { Playbar } from './Playbar'
import { PlayingQueue } from './PlayingQueue'

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
        <AudioPlayer />
        <WebSocketListener />
        <Visualizer />
        {/* <FireReaction /> */}
        <Playbar />
        <PlayingQueue />
        {/* <TrackSearch /> */}
      </AppContextProvider>
    </HarmonyThemeProvider>
  )
}
