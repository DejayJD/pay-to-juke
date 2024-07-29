import { useCallback, useContext, useState } from 'react'
import { AppContext } from './AppContext'
import { Button, Divider, Flex, Paper, Text, TextInput, TextInputSize } from '@audius/harmony'

export const Chat = () => {
  const { chatHistory, sendChatToServer } = useContext(AppContext)!
  const [user, setUser] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = useCallback(() => {
    if (!user || !msg) return
    console.log({ user, msg })
    sendChatToServer({ user, msg })
    setMsg('')
  }, [msg, sendChatToServer, user])

  return (
    <Paper
      direction='column'
      ph='l'
      pb='l'
      css={{
        position: 'fixed',
        left: 0,
        bottom: 80,
        maxHeight: 400,
        maxWidth: 500
      }}
    >
      <Flex pv='m' direction='column' gap='s'>
        <Text textAlign='center' variant='heading' size='l' color='default'>~ CHAT ~</Text>
        <Divider />
      </Flex>
      <Flex direction='column' gap='m' css={{ minHeight: 48, maxHeight: 300, overflow: 'auto' }}>
        {chatHistory.map((item) => (
          <Text variant='body' color='default'>{item.user}: {item.msg}</Text>
        ))}
      </Flex>
      <Flex direction='column' gap='s'>
      <Divider />
      <Flex gap='s' alignItems='center'>
        <TextInput size={TextInputSize.SMALL} css={{ maxWidth: 100 }} label='user' placeholder='Username' onChange={(e) => {
          const input = e.currentTarget
          setUser(input.value)
        }} />
        <TextInput size={TextInputSize.SMALL} label='msg' placeholder='Chat here' onChange={(e) => {
          const input = e.currentTarget
          setMsg(input.value)
        }} />
        <Button size='small' onClick={handleSubmit}>Submit</Button>
      </Flex>
      </Flex>
    </Paper>
  )
}
