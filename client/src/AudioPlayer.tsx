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
    isMuted,
    queue,
    setCurrentTrack
  } = useContext(AppContext)!
  const [trackUid, setTrackUid] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const setAudioRef = (el: HTMLAudioElement | null) => {
    if (!el) return

    // @ts-expect-error - just get it working
    audioRef.current = el
    setAudioPlayer(el)
    audioRef.current.volume = 0.2
  }

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
      handleCurrentTrackChange() // Hack alert - idk why calling this super aggressively is working better but it just is
      if (trackUid !== currentTrack.uid && !isMuted) {
        console.log('EFFECT: Track Change')
        handleCurrentTrackChange()
        audioRef.current?.play()
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
    isMuted,
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
        muted={isMuted}
        autoPlay
      />
    </>
  )
}
