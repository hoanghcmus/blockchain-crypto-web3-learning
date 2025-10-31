// public-blockchain.js
import { JsonRpcProvider, Wallet, parseEther } from "ethers";

async function main() {
    // RPC của Sepolia (public testnet)
    const INFURA_URL = process.env.INFURA_URL;

    // Private key ví testnet (chỉ dùng testnet, KHÔNG dùng ví thật!)
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    // 1. Tạo provider kết nối tới mạng public
    const provider = new JsonRpcProvider(INFURA_URL);

    // 2. Tạo wallet và kết nối provider
    const wallet = new Wallet(PRIVATE_KEY, provider);
    console.log("Connected wallet:", wallet.address);

    // 3. Lấy balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Balance (ETH):", parseFloat(balance / 10n ** 18n));

    // 4. Gửi transaction nhỏ (ví dụ)
    const tx = await wallet.sendTransaction({
        to: "0x000000000000000000000000000000000000dead",
        value: parseEther("0.0001"),
    });

    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Tx confirmed:", receipt.status);
}

main().catch(console.error);
