import { useContext } from 'react'
import { AppContext } from './AppContext'
import { HarmonyScrubber } from './HarmonyScrubber/HarmonyScrubber'

export const Scrubber = () => {
  const { currentTrack } = useContext(AppContext)!

  const isPlaying = currentTrack !== null

  return (
    <HarmonyScrubber
      mediaKey={currentTrack?.id ?? 'key'}
      isPlaying={isPlaying}
      includeTimestamps
      playbackRate={1}
      elapsedSeconds={0}
      totalSeconds={currentTrack?.duration ?? 0}
      isDisabled
      style={{
        railListenedColor: 'var(--track-slider-rail)',
        handleColor: 'var(--track-slider-handle)'
      }}
    />
  )
}
