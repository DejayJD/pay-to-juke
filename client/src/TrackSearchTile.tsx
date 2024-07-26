import { Button, Flex, Paper, Text } from '@audius/harmony'
import { TrackFull } from './types'
import { useContext } from 'react'
import { AppContext } from './AppContext'
import { getHrsMinsSecsText } from './utils'
import { balanceStore } from './solana_dev'

type TrackSearchTileProps = { track: TrackFull }

export const TrackSearchTile = ({ track }: TrackSearchTileProps) => {
  const balance = balanceStore((s) => s.balance)
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
          <Text variant='body' color='default' size='s'>
            {getHrsMinsSecsText(track.duration)}
          </Text>
        </Flex>
        <Button
          fullWidth
          disabled={balance < 1.0}
          onClick={() => {
            addTrackToQueue(track)
          }}
        >
          Add (1 SOL)
        </Button>
      </Flex>
    </Flex>
  )
}
