import { ethers } from "ethers";

// ====== Cấu hình mạng Cronos Testnet ======
const CRONOS_TESTNET_RPC = "https://evm-t3.cronos.org";
const provider = new ethers.JsonRpcProvider(CRONOS_TESTNET_RPC);

// ====== Ví của bạn ====== CRO Testnet
const PRIVATE_KEY = ""; // ⚠️ chỉ dùng ví test!
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ====== Địa chỉ người nhận ====== CRYPTO.COM
const toAddress = "0x12D10B2314cC42FB42Ba8b594020b6B280C244fa";

// ====== Hàm gửi giao dịch ======
async function sendTCRO() {
    const amount = ethers.parseEther("1.0"); // 1 tCRO
    console.log(`Đang gửi 1 tCRO đến ${toAddress}...`);

    const tx = await wallet.sendTransaction({
        to: toAddress,
        value: amount,
    });

    console.log("Đã gửi, đang chờ xác nhận...");
    const receipt = await tx.wait();
    console.log("✅ Giao dịch thành công!");
    console.log(`Tx Hash: ${receipt.hash}`);
    console.log(`Xem tại: https://explorer.cronos.org/testnet/address/0xb82dc9d470ccd9f40d6d8ef74a3d006c1959a90d`);
}

sendTCRO().catch(console.error);
