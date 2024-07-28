import { Paper } from '@audius/harmony'
import { Track } from '@audius/sdk'

type TrackQueueTileProps = {
  track: Track
  position: number
  isHistory?: boolean
}

// export const EmptyQueueTile = () => {
//   return (
//     <Paper
//       w={380}
//       gap='s'
//       css={{
//         top: -40,
//         flexShrink: 0
//       }}
//       direction='column'
//     />
//   )
// }

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
      {track?.artwork?.['_480x480'] ? (
        <img src={track?.artwork?.['_480x480']} alt={track.title} />
      ) : null}
    </Paper>
  )
}
