import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Button, Flex } from '@audius/harmony'

import { AppContext } from './AppContext'
import { audiusSdk } from './audiusSdk'
import { Scrubber } from './Scrubber'

export const AudioPlayer = () => {
  const { queue } = useContext(AppContext)!
  const [trackSrc, setTrackSrc] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleQueueChange = useCallback(
    async () => {
      const url = await audiusSdk.tracks.streamTrack({
        trackId: queue[0].id,
      })
      if (url !== trackSrc) {
        // console.log({ url })
        setTrackSrc(url)
        audioRef.current?.load()
      }
    },
    [queue, trackSrc]
  )

  useEffect(() => {
    console.log('QUEUE CHANGE', { queue })
    if (queue.length > 0) {
      handleQueueChange()
    } else {
      // Out of Tracks
      audioRef.current?.pause()
    }
  }, [queue, handleQueueChange])

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
