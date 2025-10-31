// private-blockchain.js
import { JsonRpcProvider, Wallet, parseEther } from "ethers";

async function main() {
    // RPC local node (private blockchain)
    const LOCAL_RPC = "http://127.0.0.1:8545";

    // Private key mặc định từ Hardhat/Ganache
    const PRIVATE_KEY =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

    // 1. Provider kết nối local node
    const provider = new JsonRpcProvider(LOCAL_RPC);

    // 2. Wallet kết nối tới private blockchain
    const wallet = new Wallet(PRIVATE_KEY, provider);
    console.log("Connected wallet:", wallet.address);

    // 3. Lấy balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Balance (ETH):", parseFloat(balance / 10n ** 18n));

    // 4. Gửi transaction thử (gần như instant confirm)
    const tx = await wallet.sendTransaction({
        to: "0x0000000000000000000000000000000000000001",
        value: parseEther("1.0"),
    });

    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Tx confirmed:", receipt.status);
}

main().catch(console.error);
