import { Paper } from '@audius/harmony'
import { Track } from '@audius/sdk'

type TrackQueueTileProps = {
  track: Track
  position: number
  isHistory?: boolean
}

export const TrackQueueTile = ({ track, position }: TrackQueueTileProps) => {
  const isPlaying = position === 0
  const size = isPlaying ? 380 : 280

  return (
    <Paper
      w={size}
      gap='s'
      css={{
        flexShrink: 0,
        ...(!isPlaying && {
          filter: 'grayscale(30%) brightness(90%) blur(1px)'
        })
      }}
      direction='column'
    >
      <img src={track.artwork?.['_480x480']} alt={track.title} />
    </Paper>
  )
}
