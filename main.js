const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAdress, toAddress, amount) {
        this.fromAdress = fromAdress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('BLOCK MINED: ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = []
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(0, Date.now().toString(), 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    mindPendingTransactions(miningRewardAddress) {
        let newBlock = new Block(Date.now(), this.pendingTransactions)
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)

        console.log("block sucessfull mined!")
        this.chain.push(newBlock)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]

    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (address == trans.fromAdress) {
                    balance -= trans.amount;
                }

                if (address == trans.toAddress) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    printChain() {
        console.log(JSON.stringify(this.chain, null, 4));
    }
}


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
stableVndtCoiin.createTransaction(new Transaction('nick-address', 'steve-address', 10000))
stableVndtCoiin.createTransaction(new Transaction('steve-address', 'nick-address', 1))

console.log("\n Starting the miner ....")
stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// --------------------------------------------------------------------------------------------------

console.log("\n Starting the miner again ....")
stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// --------------------------------------------------------------------------------------------------

stableVndtCoiin.createTransaction(new Transaction('steve-wallet-address', 'nick-address', 10))

console.log("\n Starting the miner 2nd again ....")
stableVndtCoiin.mindPendingTransactions('steve-wallet-address')

console.log("\n Steve wallet balance", stableVndtCoiin.getBalanceOfAddress('steve-wallet-address'))
// --------------------------------------------------------------------------------------------------