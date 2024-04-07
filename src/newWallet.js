const Web3 = require('web3');

// Connect to Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/<YOUR_INFURA_PROJECT_ID>'));

// Generate a new account
const account = Web3.eth.accounts.create();

console.log('Address:', account.address);
console.log('Private Key:', account.privateKey);
