import { useEffect, useRef, useState } from 'react'
import { ThemeProvider as HarmonyThemeProvider, Text } from '@audius/harmony'
import { Flex } from '@audius/harmony'

import { PlayingQueue } from './PlayingQueue'
import { TrackSearch } from './TrackSearch'
import { AppContextProvider } from './AppContext'

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingTrackId, setPlayingTrackId] = useState<string | null>()
  const [playingTrackSrc, setPlayingTrackSrc] = useState<string | undefined>()

  const audioRef = useRef<HTMLAudioElement>(null)

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

  /**
   * Update the audio player based on the isPlaying state
   */
  useEffect(() => {
    if (isPlaying && audioRef.current?.src) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  return (
    <HarmonyThemeProvider theme='day'>
      <AppContextProvider>
        <Flex direction='column' gap='m' m='2xl' alignItems='center'>
          <Flex direction='column'>
            <Text color='heading' strength='strong' variant='display'>
              Jukebox
            </Text>
          </Flex>
          <PlayingQueue />
          <TrackSearch />
        </Flex>
        {/* <audio
        css={{ display: 'none' }}
        src={playingTrackSrc}
        ref={audioRef}
        autoPlay
      /> */}
      </AppContextProvider>
    </HarmonyThemeProvider>
  )
}
