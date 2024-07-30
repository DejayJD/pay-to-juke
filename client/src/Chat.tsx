import { useContext, useState } from 'react'
import { AppContext } from './AppContext'
import {
  Divider,
  Flex,
  IconMessage,
  Paper,
  Text,
  TextInput,
  TextInputSize
} from '@audius/harmony'

export const Chat = () => {
  const { chatHistory, sendChatToServer } = useContext(AppContext)!
  const [msg, setMsg] = useState('')

  const handleSubmit = () => {
    if (!msg) return
    sendChatToServer(msg)
    setMsg('')
  }

  return (
    <Paper
      direction='column'
      ph='l'
      pb='l'
      css={{
        position: 'fixed',
        left: 0,
        bottom: 80,
        height: 'calc(100% - 280px)',
        width: 300
      }}
      justifyContent='space-between'
    >
      <Flex pv='m' direction='column' gap='s'>
        <Text textAlign='center' variant='heading' size='l' color='default'>
          CHAT
        </Text>
        <Divider />
      </Flex>
      <Flex
        direction='column'
        gap='m'
        justifyContent='flex-start'
        h='100%'
      >
        {chatHistory.map((item) => (
          <Text variant='body' color='default'>
            {item.user}: {item.msg}
          </Text>
        ))}
      </Flex>
      <Flex direction='column' gap='s'>
        <Divider />
        <Flex gap='s' alignItems='center'>
          <form
            onSubmit={(e) => {
              handleSubmit()
              e.preventDefault()
            }}
            style={{ display: 'flex', width: '100%' }}
          >
            <TextInput
              size={TextInputSize.SMALL}
              label='msg'
              placeholder=''
              onChange={(e) => {
                const input = e.currentTarget
                setMsg(input.value)
              }}
              value={msg}
              endIcon={IconMessage}
            />
          </form>
        </Flex>
      </Flex>
    </Paper>
  )
}
