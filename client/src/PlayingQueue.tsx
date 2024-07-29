import { Avatar, Flex, Text } from '@audius/harmony'
import { TrackQueueTile } from './TrackQueueTile'
import { AppContext } from './AppContext'
import { useContext } from 'react'

export const PlayingQueue = () => {
  const {
    queue,
    queueHistory: contextQueueHistory,
    currentTrack
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
      <Flex w='80%' gap='l' justifyContent='space-between'>
        {/* History */}
        <Flex
          alignItems='center'
          gap='l'
          css={{
            flexGrow: 1,
            flexBasis: 1,
            overflow: 'hidden',
            paddingBottom: 90 // Hack to semi-center the history/queue
          }}
          justifyContent='flex-end'
        >
          {queueHistory.reverse().map((track, i) => (
            <TrackQueueTile
              key={track.uid}
              track={track}
              position={(i + 1) * -1}
              isHistory
            />
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
            paddingBottom: 90 // Hack to semi-center the history/queue
          }}
        >
          {queue.map((track, i) => (
            <TrackQueueTile key={track.uid} track={track} position={i + 1} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
