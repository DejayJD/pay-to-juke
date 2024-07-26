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

// connection
const connection = new Connection('http://127.0.0.1:8899')

// keypair
const keypair = loadAccount()
export const pubkey = keypair.publicKey

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
  const balance = await connection.getBalance(pubkey, 'confirmed')
  return balance / LAMPORTS_PER_SOL
}

// payForPlay sends 12 SOL
// to the jukebox account...
export async function payForPlay() {
  const transaction = new Transaction()
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: pubkey,
      toPubkey: jukeboxAccount.publicKey,
      lamports: LAMPORTS_PER_SOL * 12,
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
}
