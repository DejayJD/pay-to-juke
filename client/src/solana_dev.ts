import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { base58 } from '@scure/base'

// connection
const connection = new Connection('http://127.0.0.1:8899')

// 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
const payer = Keypair.fromSecretKey(
  base58.decode(
    '2akUugUVUVYHxg8QhUNqcBqGsfzT4T9yPCx46XbaGUndhQ4AjZV8nDNR1HvZP5kjymQf5ooP3wreEQ1457UjhHpu'
  )
)

const toAccount = Keypair.fromSecretKey(
  base58.decode(
    '2brWef2xnp2EEG2nJARnAftSDUW9SrmX2zMVukF3Y3qDFXwuziDrHaumYdDVVTTRU9ysM3L7xQaziFDdfMRQsfV2'
  )
)

async function airdrop(k: Keypair) {
  console.log(`airdrop ${k.publicKey.toBase58()}`)
  const signature = await connection.requestAirdrop(
    k.publicKey,
    LAMPORTS_PER_SOL
  )
  await connection.confirmTransaction(signature, 'confirmed')
  const balance = await connection.getBalance(k.publicKey)
  console.log(k.publicKey.toBase58(), `${balance / LAMPORTS_PER_SOL} SOL`)
}

async function sendIt() {
  // Create Simple Transaction
  const transaction = new Transaction()

  // Add an instruction to execute
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: LAMPORTS_PER_SOL,
    })
  )

  console.log(new Date(), 'sending...')
  const txhash = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer],
    {
      commitment: 'confirmed',
    }
  )

  // get balance for recipient
  {
    console.log(new Date(), 'getting balance...')
    const k = toAccount
    const balance = await connection.getBalance(k.publicKey)
    console.log(k.publicKey.toBase58(), `${balance / LAMPORTS_PER_SOL} SOL`)
  }

  // get tx detail
  {
    console.log(new Date(), 'getting tx...')
    const tx = await connection.getParsedTransaction(txhash, {
      commitment: 'confirmed',
    })
    console.log(tx)
  }
}

function generateKeyPair() {
  const keypair = Keypair.generate()
  console.log('a private key', base58.encode(keypair.secretKey))
}

async function main() {
  generateKeyPair()
  await airdrop(toAccount)
  await sendIt()
}

main()
