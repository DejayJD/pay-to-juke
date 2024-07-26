import { Avatar, Flex, Text } from '@audius/harmony'
import { TrackQueueTile } from './TrackQueueTile'
import { AppContext } from './AppContext'
import { useContext } from 'react'

export const PlayingQueue = () => {
  const { queue, queueHistory, currentTrack } = useContext(AppContext)!

  if (queue.length === 0 && queueHistory.length === 0 && !currentTrack) {
    return (
      <Text variant='title' color='default'>
        Queue something to start the jukebox!
      </Text>
    )
  }

  return (
    <Flex w='80%' gap='l' justifyContent='space-between'>
      {/* History */}
      <Flex
        alignItems='center'
        gap='l'
        css={{
          flexGrow: 1,
          flexBasis: 1,
          overflow: 'hidden',
          paddingBottom: 90, // Hack to semi-center the history/queue
        }}
        justifyContent='flex-end'
      >
        {queueHistory.reverse().map((track, i) => (
          <TrackQueueTile track={track} position={(i + 1) * -1} isHistory />
        ))}
      </Flex>

      {/* Currently Playing */}
      <Flex css={{ flexShrink: 0 }}>
        {currentTrack ? (
          <Flex gap='s' direction='column'>
            <TrackQueueTile track={currentTrack} position={0} />
            <Avatar
              src={currentTrack.user.profilePicture?._150x150}
              size='xl'
              css={{ position: 'absolute', bottom: 50, left: -25 }}
            />
            <Text
              size='m'
              variant='title'
              color='default'
              css={({ spacing }) => ({ marginTop: spacing.xl })}
            >
              {currentTrack.title}
            </Text>
            <Text size='xs' color='default'>
              {currentTrack.user.handle}
            </Text>
          </Flex>
        ) : queue.length === 0 ? (
          <Text color='default'> nothing to play </Text>
        ) : (
          <Flex> loading... </Flex>
        )}
      </Flex>

      {/* Upcoming queue */}
      <Flex
        alignItems='center'
        gap='l'
        css={{
          flexGrow: 1,
          flexBasis: 1,
          overflow: 'hidden',
          paddingBottom: 90, // Hack to semi-center the history/queue
        }}
      >
        {queue.map(
          (track, i) => <TrackQueueTile track={track} position={i + 1} />
        )}
      </Flex>
    </Flex>
  )
}
