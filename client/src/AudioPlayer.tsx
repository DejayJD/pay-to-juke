import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Button, Flex } from '@audius/harmony'

import { AppContext } from './AppContext'
import { audiusSdk } from './audiusSdk'
import { Scrubber } from './Scrubber'

export const AudioPlayer = () => {
  const { currentTrack } = useContext(AppContext)!
  const [trackSrc, setTrackSrc] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleCurrentTrackChange = useCallback(
    async () => {
      if (!currentTrack || !audioRef.current) return
      console.log({ currentTrack })

      const url = await audiusSdk.tracks.streamTrack({
        trackId: currentTrack.id
      })

      // console.log('loading', { url })
      setTrackSrc(url)
      audioRef.current.load()
      // TODO: Set the actual currentTime
      // audioRef.current.currentTime = 100
    },
    [currentTrack]
  )

  useEffect(() => {
    // console.log('CURRENT TRACK CHANGE', { currentTrack })
    // console.log({ queue })
    if (currentTrack) {
      handleCurrentTrackChange()
    } else {
      audioRef.current?.pause()
    }
  }, [currentTrack, handleCurrentTrackChange])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  return (
    <>
      <Flex w='70%' mt='2xl'>
        <Scrubber />
        <Button onClick={() => { setIsMuted(val => !val) }}>{isMuted ? 'Unmute' : 'Mute'}</Button>
      </Flex>
      <audio
        ref={audioRef}
        css={{ display: 'none' }}
        src={trackSrc ?? undefined}
        autoPlay
      />
    </>
  )
}
