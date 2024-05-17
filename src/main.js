const fs = require("fs");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const { transferTokens, isAddressValid } = require("./tokenTransfer");
const { logError, logTransfer, logSkip } = require("./utils");

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const walletDestination = process.env.WALLET_DESTINATION;
const smartContractAddress = process.env.SMART_CONTRACT_ADDRESS;
const gasPrice = ethers.utils.parseUnits(process.env.GWEI, "gwei");
const minTransferAmount = ethers.utils.parseUnits(
  process.env.MINIMAL_TRANSFER_AMOUNT,
  "ether"
);
const chainId = parseInt(process.env.CHAIN_ID);

if (!walletDestination || !smartContractAddress) {
  logError("Missing Wallet Destination or Smart Contract Address");
  process.exit(1);
}

let privateKeys;
try {
  const data = fs.readFileSync(process.env.WALLET_PRIVATE_KEY_FILE, "utf8");
  privateKeys = JSON.parse(data);
} catch (err) {
  logError(`Error reading private key file: ${err.message}`);
  process.exit(1);
}

const wallets = privateKeys.map((pk) => new ethers.Wallet(pk, provider));

if (!isAddressValid(walletDestination)) {
  logError(`Invalid Wallet Destination Address: ${walletDestination}`);
  process.exit(1);
}

const tokenABI = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address, uint) returns (bool)",
];
const tokenContract = new ethers.Contract(
  smartContractAddress,
  tokenABI,
  wallets[0]
);

const checkAndTransfer = async () => {
  for (const wallet of wallets) {
    try {
      const walletBalance = await tokenContract.balanceOf(wallet.address);
      if (walletBalance.gt(0)) {
        const result = await transferTokens(
          wallet,
          walletDestination,
          tokenContract,
          gasPrice,
          minTransferAmount,
          chainId,
          provider
        );
        if (result.message === "Transfer successful") {
          logTransfer(
            wallet.address,
            walletDestination,
            result.balanceWallet,
            result.fee,
            result.transactionHash
          );
        } else {
          logSkip(wallet.address, result.message);
        }
      } else {
        logSkip(wallet.address, "No token balance");
      }
    } catch (error) {
      logError(`Error for wallet ${wallet.address}: ${error.message}`);
    }
  }
};

checkAndTransfer();
