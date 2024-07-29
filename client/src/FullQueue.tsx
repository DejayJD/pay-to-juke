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
        transform: 'translateY(-50%)',
        top: '50%',
        right: 0,
        maxHeight: '50vh',
      }}
    >
      <Flex pv='m' direction='column'>
        <Text  variant='heading' size='l' color='default'>~ QUEUE ~</Text>
        <Divider />
      </Flex>
      <Flex direction='column' gap='m' css={{ overflow: 'auto' }}>
        {queue.map((item, idx) => (
          <Text variant='title' color='default'>{idx+ 1}. {item.title}</Text>
        ))}
      </Flex>
    </Paper>
  )
}
