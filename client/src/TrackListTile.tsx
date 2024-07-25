import { Button, Flex, Paper, Text } from '@audius/harmony'
import { TrackFull } from './types'
import { useContext } from 'react'
import { AppContext } from './AppContext'

type TrackListTileProps = { track: TrackFull }

export const TrackListTile = ({ track }: TrackListTileProps) => {
  const { addTrackToQueue } = useContext(AppContext)!

  return (
    <Flex gap='l' w={500}>
      <Paper w={150} h={150} css={{ flexShrink: 0 }}>
        <img src={track.artwork?.['_150x150']} alt={track.title} />{' '}
      </Paper>
      <Flex
        direction='column'
        gap='m'
        justifyContent='space-between'
        w='100%'
        css={{ flex: 1, flexWrap: 'wrap' }}
      >
        <Flex gap='s' direction='column'>
          <Text variant='title' size='m' color='accent'>
            {track.title}
          </Text>
          <Text variant='body' color='default' size='s'>
            @{track.user.handle}
          </Text>
        </Flex>
        <Button
          fullWidth
          onClick={() => {
            addTrackToQueue(track)
          }}
        >
          Add
        </Button>
      </Flex>
    </Flex>
  )
}
