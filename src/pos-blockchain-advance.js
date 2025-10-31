// Advanced Proof of Stake Blockchain Simulation (Ethereum-style)
import crypto from "crypto";

// === Utility ===
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// === Validator Class ===
class Validator {
  constructor(name, stake) {
    this.name = name;
    this.stake = stake;
    // sinh cặp khóa public/private
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "secp256k1", // dùng cùng loại với Ethereum
    });
    this.publicKey = publicKey.export({ type: "spki", format: "pem" });
    this.privateKey = privateKey.export({ type: "pkcs8", format: "pem" });
  }

  sign(data) {
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, "hex");
  }

  verify(data, signature) {
    const verify = crypto.createVerify("SHA256");
    verify.update(data);
    verify.end();
    return verify.verify(this.publicKey, signature, "hex");
  }
}

// === Block Class ===
class Block {
  constructor(index, previousHash, data, validator) {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.previousHash = previousHash;
    this.validator = validator.name;
    this.hash = this.calculateHash();
    this.signature = validator.sign(this.hash); // ký block
  }

  calculateHash() {
    return sha256(
      this.index +
        this.previousHash +
        JSON.stringify(this.data) +
        this.timestamp +
        this.validator
    );
  }
}

// === Blockchain Class ===
class Blockchain {
  constructor(validators) {
    this.chain = [this.createGenesisBlock()];
    this.validators = validators;
    this.rewardPerBlock = 10;
    this.slashRate = 0.5;
    this.epoch = 1;
    this.slotsPerEpoch = 3;
  }

  createGenesisBlock() {
    return new Block(0, "0", { message: "Genesis Block" }, { name: "System", sign: () => "GENESIS" });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  get totalStake() {
    return this.validators.reduce((sum, v) => sum + v.stake, 0);
  }

  // chọn validator theo tỷ lệ stake
  selectValidator() {
    const rand = Math.random() * this.totalStake;
    let cumulative = 0;
    for (const v of this.validators) {
      cumulative += v.stake;
      if (rand < cumulative) return v;
    }
  }

  createBlock(data) {
    const validator = this.selectValidator();
    const newBlock = new Block(
      this.chain.length,
      this.getLatestBlock().hash,
      data,
      validator
    );

    // xác minh chữ ký
    if (!validator.verify(newBlock.hash, newBlock.signature)) {
      console.log(`❌ ${validator.name} ký sai block!`);
      this.slashValidator(validator);
      return;
    }

    this.chain.push(newBlock);
    validator.stake += this.rewardPerBlock;
    console.log(
      `✅ Epoch ${this.epoch}, Block #${newBlock.index} bởi ${validator.name} (stake +${this.rewardPerBlock})`
    );

    // kiểm tra chuyển epoch
    if (newBlock.index % this.slotsPerEpoch === 0) {
      this.epoch++;
      console.log(`⏭️  Epoch mới bắt đầu: ${this.epoch}`);
    }
  }

  slashValidator(validator) {
    const penalty = validator.stake * this.slashRate;
    validator.stake -= penalty;
    console.log(`⚠️  ${validator.name} bị phạt -${penalty} stake vì gian lận!`);
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

// === DEMO ===
const validators = [
  new Validator("Alice", 50),
  new Validator("Bob", 30),
  new Validator("Charlie", 20),
];

const posChain = new Blockchain(validators);

// tạo 9 block (3 epoch, mỗi epoch có 3 slot)
for (let i = 1; i <= 9; i++) {
  posChain.createBlock({ tx: `Tx_${i}` });
}

console.log("\n🧾 Blockchain Summary:");
console.log(
  posChain.chain.map((b) => ({
    index: b.index,
    validator: b.validator,
    hash: b.hash.slice(0, 10) + "...",
  }))
);

console.log("\n💰 Stakes:");
console.table(validators.map((v) => ({ name: v.name, stake: v.stake })));

console.log("\nChuỗi hợp lệ?", posChain.isChainValid());
