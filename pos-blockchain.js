// Proof of Stake Blockchain Simulation in JavaScript
import crypto from "crypto"; 

class Block {
    constructor(index, previousHash, data, validator) {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.validator = validator;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(
                this.index +
                this.previousHash +
                JSON.stringify(this.data) +
                this.timestamp +
                this.validator
            )
            .digest("hex");
    }
}

class Validator {
    constructor(name, stake = 0) {
        this.name = name;
        this.stake = stake;
    }
}

class Blockchain {
    constructor(validators) {
        this.chain = [this.createGenesisBlock()];
        this.validators = validators;
        this.rewardPerBlock = 10;
    }

    createGenesisBlock() {
        return new Block(0, "0", { message: "Genesis Block" }, "System");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    get totalStake() {
        return this.validators.reduce((sum, v) => sum + v.stake, 0);
    }

    // chọn validator theo tỷ lệ stake (PoS)
    selectValidator() {
        const rand = Math.random() * this.totalStake;
        let cumulative = 0;
        for (const v of this.validators) {
            cumulative += v.stake;
            if (rand < cumulative) return v;
        }
    }

    // tạo block mới
    createBlock(data) {
        const validator = this.selectValidator();
        const newBlock = new Block(
            this.chain.length,
            this.getLatestBlock().hash,
            data,
            validator.name
        );
        this.chain.push(newBlock);

        // thưởng cho validator
        validator.stake += this.rewardPerBlock;

        console.log(
            `✅ Block #${newBlock.index} được tạo bởi ${validator.name} (stake +${this.rewardPerBlock})`
        );
    }

    // giả lập hành vi gian lận
    slashValidator(name) {
        const validator = this.validators.find((v) => v.name === name);
        if (validator) {
            const penalty = validator.stake * 0.5;
            validator.stake -= penalty;
            console.log(`⚠️  ${name} bị phạt -${penalty} stake vì gian lận!`);
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];
            if (current.hash !== current.calculateHash()) return false;
            if (current.previousHash !== prev.hash) return false;
        }
        return true;
    }
}

// ====== DEMO ======
const validators = [
    new Validator("Alice", 50),
    new Validator("Bob", 30),
    new Validator("Charlie", 20),
];

const posChain = new Blockchain(validators);

// mô phỏng tạo block
for (let i = 1; i <= 5; i++) {
    posChain.createBlock({ transaction: `Tx_${i}` });
}

// giả lập 1 validator gian lận
posChain.slashValidator("Bob");

console.log("\n🧾 Chuỗi blockchain:");
console.log(posChain.chain.map((b) => ({
    index: b.index,
    validator: b.validator,
    hash: b.hash.substring(0, 10) + "...",
    prev: b.previousHash.substring(0, 10) + "...",
})));

console.log("\n💰 Tổng stake:");
console.table(validators.map(v => ({ name: v.name, stake: v.stake })));

console.log("\nChuỗi hợp lệ?", posChain.isChainValid());
