
const { ethers, JsonRpcProvider, parseEther } = require("ethers")

const INFURA_API_KEY ="58287423e11f4152bceac5df13b2a28e"
const NETWORK = "polygon-amoy"
const ADDRESS = '0x14d27B0a0B9f01F9B5243DCA4dd93D4d3eef15C2'
const PRIVATE_KEY = '0xbc994385d80c6bd6fb617e76a8446d260f63a262a46d45498aec09d5dc405dce'

const provider = new JsonRpcProvider(`https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`)

const createAccount = () => {
  const account = ethers.Wallet.createRandom();
  console.log(`Address: ${account.address}`)
  console.log(`Private Key: ${account.privateKey}`)
}

const Transaction = async (recipient, amount) => {
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)
  const amountToSend = parseEther(amount)

  const transactInfo = {
    to:recipient,
    value:amountToSend,
  }

  const gasLimit = await provider.estimateGas(transactInfo)

  const tx = await signer.sendTransaction({
    ...transactInfo,
    gasLimit,
  })

  console.log(`Transaction Hash: ${tx.hash}`)
  console.log("Waiting for Transaction to be mined...")

  const receipt = await tx.wait()
  console.log(`Transaction was mined in block ${receipt.blockNumber}`)
}

// const recipient = '0xE4E0166c45FfFaa4C051Ae01895F1C23b8a3443C'
// const amount = '0.2'

Transaction(recipient, amount)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


export {Transaction};
