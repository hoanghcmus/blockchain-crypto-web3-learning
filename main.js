const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
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

    printChain() {
        console.log(JSON.stringify(this.chain, null, 4));
    }
}

// Example usage:
let myCoin = new Blockchain();
// myCoin.addBlock(new Block(1, Date.now().toString(), { amount: 4 }));
// myCoin.addBlock(new Block(2, Date.now().toString(), { amount: 10 }));

// console.log('Is blockchain valid? ' + myCoin.isChainValid());
// myCoin.printChain();

// myCoin.chain[1].data = { amount: 5 }; // Tampering with the data
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash(); // Recalculate hash after tampering

// console.log('Is blockchain still valid? ' + myCoin.isChainValid());
// myCoin.printChain();            


console.log('Mining block 1...');
myCoin.addBlock(new Block(1, Date.now().toString(), { amount: 4 }));

console.log('Mining block 2...');
myCoin.addBlock(new Block(2, Date.now().toString(), { amount: 10 }));