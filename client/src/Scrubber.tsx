import { useContext } from 'react'

import { Box, Flex, Text, useTheme } from '@audius/harmony'
import moment from 'moment'

import { AppContext } from './AppContext'

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR

/** Pretty formats seconds into m:ss. */
const formatSeconds = (seconds: number) => {
  const utc = moment.utc(moment.duration(seconds, 'seconds').asMilliseconds())
  if (seconds > SECONDS_PER_HOUR) {
    return utc.format('h:mm:ss')
  }
  return utc.format('m:ss')
}

export const Scrubber = ({ elapsed = 0 }: { elapsed?: number }) => {
  const { color } = useTheme()
  const { currentTrack } = useContext(AppContext)!
  const totalSeconds = currentTrack?.duration ?? 0

  return (
    <Flex w='100%' alignItems='center' gap='s'>
      <Text color='default'>{formatSeconds(elapsed)}</Text>
      <Flex flex={1}>
        <Box
          w='100%'
          h={4}
          backgroundColor='surface2'
          borderRadius='s'
          css={{ position: 'absolute' }}
        />
        <Box
          w={`${(elapsed / totalSeconds) * 100}%`}
          h={4}
          borderRadius='s'
          css={{
            position: 'absolute',
            backgroundColor: color.neutral.neutral
          }}
        />
      </Flex>
      <Text color='default'>{formatSeconds(totalSeconds)}</Text>
    </Flex>
  )
}
