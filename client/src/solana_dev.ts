import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  PublicKey,
} from '@solana/web3.js'
import { base58 } from '@scure/base'
import { create } from 'zustand'

// connection
const connection = new Connection('https://jukeboxrpc.audius.co', {
  wsEndpoint: 'https://jukeboxwss.audius.co'
})

// keypair
const keypair = loadAccount()
export const pubkey = keypair.publicKey

// balance state container
export const balanceStore = create(() => ({
  balance: 0,
}))

// restore keypair from localStorage
function loadAccount() {
  const STORAGE_KEY = 'jukebox-secret-key'
  let secretKey = localStorage.getItem(STORAGE_KEY)
  if (!secretKey) {
    const keypair = Keypair.generate()
    secretKey = base58.encode(keypair.secretKey)
    localStorage.setItem(STORAGE_KEY, secretKey)
  }
  const kp = Keypair.fromSecretKey(base58.decode(secretKey))
  const pubkey = kp.publicKey.toBase58()
  console.log('public key', pubkey)
  console.log('private key', secretKey)
  return kp
}

const jukeboxAccount = Keypair.fromSecretKey(
  base58.decode(
    '2brWef2xnp2EEG2nJARnAftSDUW9SrmX2zMVukF3Y3qDFXwuziDrHaumYdDVVTTRU9ysM3L7xQaziFDdfMRQsfV2'
  )
)

// airdrop
export async function airdrop(pubkey: PublicKey) {
  const signature = await connection.requestAirdrop(
    pubkey,
    LAMPORTS_PER_SOL / 10
  )
  await connection.confirmTransaction(signature, 'confirmed')
  return getBalance(pubkey)
}

// get balance
export async function getBalance(pubkey: PublicKey) {
  const lamportBalance = await connection.getBalance(pubkey, 'confirmed')
  const balance = lamportBalance / LAMPORTS_PER_SOL
  balanceStore.setState({ balance })
  return balance
}

// payForPlay sends 1 SOL
// to the jukebox account...
export async function payForPlay() {
  // return getBalance(keypair.publicKey)
  const transaction = new Transaction()
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: pubkey,
      toPubkey: jukeboxAccount.publicKey,
      lamports: LAMPORTS_PER_SOL,
    })
  )

  // send
  const txhash = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
    {
      commitment: 'confirmed',
    }
  )

  // get tx detail
  {
    console.log(new Date(), 'getting tx...')
    const tx = await connection.getParsedTransaction(txhash, {
      commitment: 'confirmed',
    })
    console.log(tx)
  }

  await getBalance(keypair.publicKey)
}
