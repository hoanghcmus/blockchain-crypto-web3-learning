// wallet-example-v6.js
import { Wallet, HDNodeWallet, parseEther, parseUnits } from "ethers";

async function main() {
  // 1. Tạo ví ngẫu nhiên
  const walletRandom = Wallet.createRandom();
  console.log("Address:", walletRandom.address);
  console.log("Private Key:", walletRandom.privateKey);
  console.log("Mnemonic:", walletRandom.mnemonic?.phrase);

  // 2. Tạo ví từ mnemonic
  const mnemonic = walletRandom.mnemonic.phrase;
  const walletFromMnemonic = HDNodeWallet.fromPhrase(mnemonic);
  console.log("\nWallet from Mnemonic:", walletFromMnemonic.address);

  // 3. Ký message
  const message = "Hello blockchain!";
  const signedMessage = await walletFromMnemonic.signMessage(message);
  console.log("\nSigned Message:", signedMessage);

  // 4. Tạo transaction mẫu (chưa gửi)
  const tx = {
    to: "0x0000000000000000000000000000000000000001",
    value: parseEther("0.001"),
    gasLimit: 21000n, // BigInt native
    gasPrice: parseUnits("20", "gwei"), // parseUnits vẫn hoạt động
    nonce: 0,
    chainId: 1,
  };

  // 5. Ký transaction
  const signedTx = await walletFromMnemonic.signTransaction(tx);
  console.log("\nSigned Transaction:", signedTx);
}

main().catch(console.error);
