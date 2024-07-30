import { useContext } from 'react'
import { AppContext } from './AppContext'
import { Divider, Flex, Paper, Text } from '@audius/harmony'

export const FullQueue = () => {
  const { queue } = useContext(AppContext)!

  if (queue.length === 0) return null

  return (
    <Paper
      direction='column'
      ph='l'
      pb='l'
      css={{
        position: 'fixed',
        right: 0,
        bottom: 80,
        maxHeight: 400,
        maxWidth: 500
      }}
    >
      <Flex pv='m' direction='column' gap='s'>
        <Text textAlign='center' variant='heading' size='l' color='default'>
          QUEUE
        </Text>
        <Divider />
      </Flex>
      <Flex direction='column' gap='m' css={{ overflow: 'auto' }}>
        {queue.map(({ track, requester }, idx) => (
          <Text variant='title' color='default'>
            {idx + 1}. @{track?.user?.handle} - {track.title} - @
            {requester?.handle}
          </Text>
        ))}
      </Flex>
    </Paper>
  )
}
