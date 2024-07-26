import { useEffect } from 'react'
import { airdrop, balanceStore, getBalance, pubkey } from './solana_dev'
import { Text } from '@audius/harmony'

const address = pubkey.toBase58()

export function Balance() {
  const balance = balanceStore((s) => s.balance)

  useEffect(() => {
    getBalance(pubkey)

    const interval = setInterval(() => {
      airdrop(pubkey).then((b) => {
        console.log(address, b)
      })
    }, 10 * 1000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [])

  return (
    <Text
      // color='default'
      textAlign='center'
      style={{
        backgroundColor: 'pink',
        padding: '10px 50px',
        color: 'darkpurple',
        borderRadius: 100,
      }}
    >
      <b style={{ fontWeight: 'bold', fontSize: 24 }} title={address}>
        {trunc(balance)} SOL
      </b>
    </Text>
  )
}

function trunc(number: number) {
  return Math.trunc(number * 10) / 10
}
