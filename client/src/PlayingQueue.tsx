import { Divider, Flex, Text } from '@audius/harmony'
import { TrackQueueTile } from './TrackQueueTile'
import { AppContext } from './AppContext'
import { useContext } from 'react'
import { CurrentListeners } from './CurrentListeners'

export const PlayingQueue = () => {
  const {
    queue,
    queueHistory: contextQueueHistory,
    currentTrack,
    currentRequester
  } = useContext(AppContext)!
  const queueHistory = [...contextQueueHistory]


  if (queue.length === 0 && !currentTrack) {
    return (
      <Flex alignItems='center' justifyContent='center' h='200px'>
        <Text variant='heading' color='default' size='s' textAlign='center'>
          Queue something to start the jukebox!
        </Text>
      </Flex>
    )
  }
  return (
    <Flex w='100%' justifyContent='center'>
      <Flex
        w='80%'
        gap='l'
        justifyContent='space-between'
        css={{ position: 'relative' }}
      >
        {/* History */}
        <Flex
          alignItems='flex-start'
          gap='l'
          css={{
            flexGrow: 1,
            flexBasis: 1,
            overflow: 'hidden',
            position: 'relative',
            paddingTop: 35 // Hack to semi-center the history/queue
          }}
          justifyContent='flex-end'
        >
          {queueHistory.reverse().map(({ track, requester }, i) => (
            <TrackQueueTile
              key={track.uid}
              track={track}
              position={(i + 1) * -1}
              isHistory
              requester={requester}
            />
          ))}
        </Flex>

        {/* Currently Playing */}
        <Flex css={{ flexShrink: 0 }}>
          {currentTrack ? (
            <Flex gap='s' direction='column'>
              <Flex css={{ position: 'relative' }}>
                <TrackQueueTile
                  track={currentTrack}
                  position={0}
                  requester={currentRequester}
                />
              </Flex>
              <Text
                size='m'
                variant='title'
                color='default'
                css={({ spacing }) => ({ marginTop: spacing.xl })}
              >
                {currentTrack.title}
              </Text>
              <Text size='xs' color='default' variant='body' strength='strong'>
                @{currentTrack.user.handle}
              </Text>
              <Flex mv='l' direction='column'>
                <Divider />
              </Flex>
              <CurrentListeners />
            </Flex>
          ) : (
            <Flex> loading... </Flex>
          )}
        </Flex>

        {/* Upcoming queue */}
        <Flex
          alignItems='flex-start'
          gap='l'
          css={{
            flexGrow: 1,
            flexBasis: 1,
            overflow: 'hidden',
            position: 'relative',
            paddingTop: 35 // Hack to semi-center the history/queue
          }}
        >
          {queue.map(({ track, requester }, i) => (
            <TrackQueueTile
              key={track.uid}
              track={track}
              requester={requester}
              position={i + 1}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
