const { ethers } = require("ethers");
const colors = require("colors");

const getCurrentDateTime = () => {
  const now = new Date();
  const formattedDate = `${padZero(now.getDate())}-${padZero(
    now.getMonth() + 1
  )}-${now.getFullYear()}`;
  const formattedTime = `${padZero(now.getHours())}:${padZero(
    now.getMinutes()
  )}:${padZero(now.getSeconds())}`;
  return `[${formattedDate} ${formattedTime}]`;
};

const padZero = (num) => num.toString().padStart(2, "0");

const logError = (message) => {
  console.error(colors.red("[ERROR]"), getCurrentDateTime(), message);
};

const logTransfer = (
  walletAddress,
  walletDestination,
  balanceWallet,
  fee,
  transactionHash
) => {
  console.log(
    colors.green("[TRANSFER]"),
    getCurrentDateTime(),
    `[${walletAddress}] Transfer from ${walletAddress} to ${walletDestination} value ${ethers.utils.formatUnits(
      balanceWallet,
      18
    )} with paid gas fee ${ethers.utils.formatUnits(
      fee,
      18
    )} Transaction Hash: ${transactionHash}`
  );
};

const logSkip = (walletAddress, message) => {
  console.log(
    colors.yellow("[SKIP]"),
    getCurrentDateTime(),
    `[${walletAddress}]`,
    message
  );
};

module.exports = {
  getCurrentDateTime,
  padZero,
  logError,
  logTransfer,
  logSkip,
};
