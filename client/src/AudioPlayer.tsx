import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Button, Flex } from '@audius/harmony'

import { AppContext } from './AppContext'
import { audiusSdk } from './audiusSdk'
import { Scrubber } from './Scrubber'
import { useInterval } from 'react-use'

const getSeekPosition = (startTime: Date) => {
  const then = new Date(startTime).getTime()
  const now = new Date().getTime()
  const currentTime = now - then
  return currentTime / 1000 // convert to seconds
}

export const AudioPlayer = () => {
  const { currentTrack, currentTrackStartTime } = useContext(AppContext)!
  const [trackUid, setTrackUid] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleCurrentTrackChange = useCallback(
    async () => {
      if (!currentTrack || !currentTrackStartTime || !audioRef.current) return
      const url = await audiusSdk.tracks.streamTrack({
        trackId: currentTrack.id
      })

      // Set src and load
      setTrackUid(currentTrack.uid)
      audioRef.current.src = url
      audioRef.current.load()

      // Set seek position
      audioRef.current.currentTime = getSeekPosition(currentTrackStartTime)
    },
    [currentTrack, currentTrackStartTime]
  )

  useEffect(() => {
    if (currentTrack) {
      if (trackUid !== currentTrack.uid && !isMuted) {
        console.log('EFFECT: Track Change')
        handleCurrentTrackChange()
      }
    } else if (trackUid) {
      console.log('EFFECT: End Playback')
      audioRef.current?.pause()
    }
  }, [currentTrack, handleCurrentTrackChange, isMuted, trackUid])

  useInterval(() => {
    if (trackUid && audioRef.current) {
      setElapsedTime(audioRef.current.currentTime)
    }
  }, 200)

  return (
    <>
      <Flex w='70%' mt='2xl'>
        <Scrubber elapsed={elapsedTime} />
        <Button onClick={() => { setIsMuted(val => !val) }}>{isMuted ? 'Unmute' : 'Mute'}</Button>
      </Flex>
      <audio
        ref={audioRef}
        css={{ display: 'none' }}
        muted={isMuted}
        autoPlay
      />
    </>
  )
}
