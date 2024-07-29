import { useCallback, useContext, useEffect, useRef, useState } from 'react'

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
  const {
    currentTrack,
    currentTrackStartTime,
    setAudioPlayer,
    queue,
    setCurrentTrack,
    volume
  } = useContext(AppContext)!
  const [trackUid, setTrackUid] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const setAudioRef = (el: HTMLAudioElement | null) => {
    if (!el || audioRef.current) return

    // @ts-expect-error - just get it working
    audioRef.current = el
    setAudioPlayer(el)
    audioRef.current.volume = 0.2
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleCurrentTrackChange = useCallback(async () => {
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
  }, [currentTrack, currentTrackStartTime])

  useEffect(() => {
    audioRef.current?.addEventListener('ended', () => {})
  }, [queue.length, setCurrentTrack])

  useEffect(() => {
    if (currentTrack) {
      if (trackUid !== currentTrack.uid) {
        console.log('EFFECT: Track Change')
        handleCurrentTrackChange()
        if (audioRef.current) {
          audioRef.current.play()
          audioRef.current.volume = 0.2
        }
      }
    } else if (trackUid) {
      console.log('EFFECT: End Playback')
      if (queue.length === 0) {
        setCurrentTrack(null)
      }
      audioRef.current?.pause()
    }
  }, [
    currentTrack,
    handleCurrentTrackChange,
    queue.length,
    setCurrentTrack,
    trackUid
  ])

  useInterval(() => {
    if (trackUid && audioRef.current) {
      setElapsedTime(audioRef.current.currentTime)
    }
  }, 200)

  return (
    <>
      <Scrubber elapsed={elapsedTime} />
      <audio
        ref={(ref) => setAudioRef(ref)}
        css={{ display: 'none' }}
        autoPlay
      />
    </>
  )
}
