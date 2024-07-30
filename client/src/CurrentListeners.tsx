import { Avatar, Flex, IconHeadphones, Text } from '@audius/harmony'
import { AppContext } from './AppContext'
import { useContext } from 'react'

export const CurrentListeners = () => {
  const { listeners } = useContext(AppContext)!
  return (
    <Flex gap='s' direction='column'>
      <Flex alignItems='center' gap='xs'>
        <Text size='s' variant='heading' color='default'>
          Current Listeners
        </Text>
        <IconHeadphones color='default' />
      </Flex>
      <Flex gap='l' direction='row'>
        {listeners.map((listenerUser) => (
          <Flex gap='s' direction='column' alignItems='center'>
            <Avatar src={listenerUser?.profilePicture?._150x150} size='xl' />
            <Text variant='body' color='default' strength='strong'>
              @{listenerUser.handle}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
