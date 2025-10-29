
const { Blockchain, Transaction } = require("./blockchain")
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const steveKey = ec.keyFromPrivate('c83ecddf84f8562ca105b669ca34978fdce85712dcbbd32259ad131ac85a14e8');

// From that we can calculate your public key (which doubles as your wallet address)
const steveWalletAddress = steveKey.getPublic('hex');

let stableVndtCoiin = new Blockchain();
// PART 1 TEST
// stableVndtCoiin.addBlock(new Block(1, Date.now().toString(), { amount: 4 }));
// stableVndtCoiin.addBlock(new Block(2, Date.now().toString(), { amount: 10 }));

// console.log('Is blockchain valid? ' + stableVndtCoiin.isChainValid());
// stableVndtCoiin.printChain();
// --------------------------------------------------------------------------------------------------

// stableVndtCoiin.chain[1].transactions = { amount: 5 }; // Tampering with the transactions
// stableVndtCoiin.chain[1].hash = stableVndtCoiin.chain[1].calculateHash(); // Recalculate hash after tampering

// console.log('Is blockchain still valid? ' + stableVndtCoiin.isChainValid());
// stableVndtCoiin.printChain();            
// --------------------------------------------------------------------------------------------------

// PART 2 TEST
// console.log('Mining block 1...');
// stableVndtCoiin.addBlock(new Block(1, Date.now().toString(), { amount: 4 }));

// console.log('Mining block 2...');
// stableVndtCoiin.addBlock(new Block(2, Date.now().toString(), { amount: 10 }));
// --------------------------------------------------------------------------------------------------

// PART 3 TEST
// stableVndtCoiin.createTransaction(new Transaction('nick-address', 'steve-address', 10000))
// stableVndtCoiin.createTransaction(new Transaction('steve-address', 'nick-address', 1))

// console.log("\n Starting the miner ....")
// stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

// console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// // --------------------------------------------------------------------------------------------------

// console.log("\n Starting the miner again ....")
// stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

// console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// // --------------------------------------------------------------------------------------------------

// stableVndtCoiin.createTransaction(new Transaction('steve-wallet-address', 'nick-address', 10))

// console.log("\n Starting the miner 2nd again ....")
// stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

// console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// --------------------------------------------------------------------------------------------------


// PART 4 TEST
const tx1 = new Transaction(steveWalletAddress, 'nick-wallet-address', 10);
tx1.sign(steveKey);
stableVndtCoiin.addTransaction(tx1);

console.log("\n Starting the miner ....")
stableVndtCoiin.mindPendingTransactions(steveWalletAddress)

console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress(steveWalletAddress))

console.log("\n Starting the miner 2nd again ....")
stableVndtCoiin.mindPendingTransactions(steveWalletAddress)

console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress(steveWalletAddress))