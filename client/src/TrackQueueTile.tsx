import { Avatar, Paper } from '@audius/harmony'
import { Track } from '@audius/sdk'

type TrackQueueTileProps = {
  track: Track
  position: number
  isHistory?: boolean
}

export const TrackQueueTile = ({ track, position }: TrackQueueTileProps) => {
  const isPlaying = position === 0
  const size = isPlaying ? 200 : 150

  return (
    <Paper w={size} h={size} gap='s' css={{ flexShrink: 0 }}>
      <img src={track.artwork?.['_150x150']} alt={track.title} />{' '}
      {isPlaying && (
        <Avatar size='xl' src={track.user.profilePicture?._150x150} />
      )}
    </Paper>
  )
}
