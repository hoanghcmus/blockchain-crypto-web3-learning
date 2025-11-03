import { ethers } from "ethers";

// ====== Setup CRONOS RPC provider======
const CRONOS_TESTNET_RPC = "https://evm-t3.cronos.org";
const cronosProvider = new ethers.JsonRpcProvider(CRONOS_TESTNET_RPC);


// ====== CRONOS Wallet ====== CRO Testnet
const CRONOS_PRIVATE_KEY = "PRIVATE_KEY_HERE"; // ⚠️ Only use test wallet!
const cronosWallet = new ethers.Wallet(CRONOS_PRIVATE_KEY, cronosProvider);

// ====== CRONOS Receive address ====== CRO Faucet
const toCronosAddress = "0x12D10B2314cC42FB42Ba8b594020b6B280C244fa";

// ====== Send CRO on tesnet ======
async function sendTCRO() {

    console.log(`Sending 1 tCRO to ${toCronosAddress}...`);
    const tx = await cronosWallet.sendTransaction({
        to: toCronosAddress,
        value: ethers.parseEther("1.0"), // 1 tCRO
    });

    console.log("Sent, waiting for confirm...");
    const receipt = await tx.wait();
    console.log("✅ Successfull CRO transaction!");
    console.log(`Tx Hash: ${receipt.hash}`);
    console.log(`Review at: https://explorer.cronos.org/testnet/address/0xb82dc9d470ccd9f40d6d8ef74a3d006c1959a90d`);
}


// Setup Sepolia RPC provider
// const ETH_TESTNET_RPC = "https://rpc.sepolia.org";
const ETH_TESTNET_RPC = "https://eth-sepolia.public.blastapi.io/"
const ethPpethrovider = new ethers.JsonRpcProvider(ETH_TESTNET_RPC);

// Load ETH wallet (⚠️ keep private key safe!)
const ethPrivateKey = "PRIVATE_KEY_HERE";
const ethWallet = new ethers.Wallet(ethPrivateKey, ethPpethrovider);

// ====== CRONOS Receive address ====== CRO Faucet
const toEthAddress = "0xa7e4ef0a9e15bdef215e2ed87ae050f974ecd60b";

// Send ETH transaction
async function sendEth() {
    console.log(`Sending 1 sepoliaETH to ${toEthAddress}...`);
    const tx = await ethWallet.sendTransaction({
        to: toEthAddress, // Sepolia faucet
        value: ethers.parseEther("0.001"), // 0.001 ETH
    });

    console.log("Sent, waiting for confirm...");
    const receipt = await tx.wait();
    console.log("Transaction hash:", tx.hash);
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
    console.log(`Review at: https://sepolia.etherscan.io/address/0xB82DC9d470ccD9f40d6d8ef74A3d006C1959A90D`);
}


// sendTCRO().catch(console.error);
sendEth().catch(console.error);

