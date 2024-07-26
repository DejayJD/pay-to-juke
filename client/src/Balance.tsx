import { useEffect, useState } from 'react'
import { airdrop, getBalance, pubkey } from './solana_dev'
import { Text } from '@audius/harmony'

const address = pubkey.toBase58()

export function Balance() {
  const [bal, setBal] = useState(0.0)

  useEffect(() => {
    getBalance(pubkey).then(setBal)

    const interval = setInterval(() => {
      airdrop(pubkey).then((b) => {
        console.log(address, b)
        setBal(b)
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
        {bal} SOL
      </b>
    </Text>
  )
}
