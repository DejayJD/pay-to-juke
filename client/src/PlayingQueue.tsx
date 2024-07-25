import { Flex, Text } from '@audius/harmony'
import { TrackQueueTile } from './TrackQueueTile'
import { AppContext } from './AppContext'
import { useContext } from 'react'

export const PlayingQueue = () => {
  const { queue, queueHistory, currentTrack } = useContext(AppContext)!

  if (queue.length === 0 && queueHistory.length === 0 && !currentTrack) {
    return <Text variant='title'>Queue something to start the jukebox!</Text>
  }

  return (
    <Flex
      w='80%'
      css={{ overflow: 'hidden' }}
      gap='l'
      justifyContent='space-between'
    >
      {/* History */}
      <Flex
        alignItems='center'
        gap='l'
        css={{ flexGrow: 1, flexBasis: 1, overflow: 'hidden' }}
        justifyContent='flex-end'
      >
        {queueHistory.reverse().map((track, i) => (
          <TrackQueueTile track={track} position={(i + 1) * -1} isHistory />
        ))}
      </Flex>
      {/* Currently Playing */}
      <Flex css={{ flexShrink: 0 }}>
        {currentTrack ? (
          <TrackQueueTile track={currentTrack} position={0} />
        ) : queue.length === 0 ? (
          <Text> nothing to play </Text>
        ) : (
          <Flex> loading... </Flex>
        )}
      </Flex>

      {/* Upcoming queue */}
      <Flex
        alignItems='center'
        gap='l'
        css={{ flexGrow: 1, flexBasis: 1, overflow: 'hidden' }}
      >
        {queue.map(
          (track, i) => i !== 0 && <TrackQueueTile track={track} position={i} />
        )}
      </Flex>
    </Flex>
  )
}
