import { Avatar, Box, Paper } from '@audius/harmony'
import { Track, User } from '@audius/sdk'

type TrackQueueTileProps = {
  track: Track
  position: number
  isHistory?: boolean
  requester?: User | null
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

export const TrackQueueTile = ({
  track,
  requester,
  position
}: TrackQueueTileProps) => {
  const isPlaying = position === 0
  const size = isPlaying ? 280 : 220

  return (
    <Box>
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
      {isPlaying ? (
        <Avatar
          src={track?.user?.profilePicture?._150x150}
          size='xl'
          css={{ position: 'absolute', bottom: -25, left: -25 }}
        />
      ) : null}
      <Avatar
        src={requester?.profilePicture?._150x150}
        css={{
          position: 'absolute',
          bottom: -15,
          right: -15,
          height: 50,
          width: 50
        }}
      />
    </Box>
  )
}
