import { useEffect } from 'react'
import { airdrop, balanceStore, getBalance, pubkey } from './solana_dev'
import { Flex, IconWallet, Text } from '@audius/harmony'

const address = pubkey.toBase58()

function trunc(number: number) {
  return Math.trunc(number * 10) / 10
}

export function Balance() {
  const balance = balanceStore((s) => s.balance)

  useEffect(() => {
    getBalance(pubkey)

    const interval = setInterval(() => {
      airdrop(pubkey).then((b) => {
        console.debug('Airdropped sol ', address, b)
      })
    }, 10 * 1000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [])

  return (
    <Flex gap='xs' alignItems='center'>
      <IconWallet size='2xl' color='default' />
      <Text color='default'>{trunc(balance)} SOL</Text>
    </Flex>
  )
}
