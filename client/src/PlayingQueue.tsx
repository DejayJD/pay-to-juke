import { Button, Flex } from '@audius/harmony'
import { TrackQueueTile } from './TrackQueueTile'
import { AppContext } from './AppContext'
import { useContext } from 'react'

export const PlayingQueue = () => {
  const { playingQueue, queueHistory, setPlayingQueue, setQueueHistory } =
    useContext(AppContext)!

  const moveToHistory = () => {
    const newHistoryQueue = [...queueHistory, playingQueue[0]]
    const newPlayingQueue = playingQueue.slice(1)
    setPlayingQueue(newPlayingQueue)
    setQueueHistory(newHistoryQueue)
  }

  if (playingQueue.length === 0) {
    return null
  }

  return (
    <Flex direction='column' w='80%' gap='2xl'>
      <Flex
        w='100%'
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
            <TrackQueueTile track={track} position={i + 1} isHistory />
          ))}
        </Flex>
        {/* Playing */}
        <Flex css={{ flexShrink: 0 }}>
          <TrackQueueTile track={playingQueue[0]} position={0} />
        </Flex>

        {/* Upcoming queue */}
        <Flex
          alignItems='center'
          gap='l'
          css={{ flexGrow: 1, flexBasis: 1, overflow: 'hidden' }}
        >
          {playingQueue.map(
            (track, i) =>
              i !== 0 && <TrackQueueTile track={track} position={i} />
          )}
        </Flex>
      </Flex>
      <Button onClick={moveToHistory}>Shift Queue</Button>
    </Flex>
  )
}
