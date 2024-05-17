const { ethers } = require("ethers");

const transferTokens = async (
  wallet,
  walletDestination,
  tokenContract,
  gasPrice,
  minTransferAmount,
  chainId,
  provider
) => {
  try {
    const balanceWallet = await tokenContract.balanceOf(wallet.address);

    if (balanceWallet.gte(minTransferAmount)) {
      const estimatedGas = await tokenContract.estimateGas.transfer(
        walletDestination,
        balanceWallet
      );

      const fee = estimatedGas.mul(gasPrice);
      const totalTransferAmount = balanceWallet.sub(fee);

      const transaction = {
        to: walletDestination,
        data: tokenContract.interface.encodeFunctionData("transfer", [
          walletDestination,
          totalTransferAmount,
        ]),
        gasLimit: estimatedGas,
        gasPrice,
        nonce: await wallet.getTransactionCount(),
        chainId,
      };

      const signedTransaction = await wallet.signTransaction(transaction);
      const txResponse = await provider.sendTransaction(signedTransaction);
      const transactionReceipt = await txResponse.wait();

      return {
        message: "Transfer successful",
        transactionHash: transactionReceipt.transactionHash,
        balanceWallet,
        fee,
      };
    } else {
      return {
        message: `Token balance is less than ${ethers.utils.formatUnits(
          minTransferAmount,
          18
        )}`,
        transactionHash: null,
        balanceWallet,
      };
    }
  } catch (error) {
    throw new Error(`An error occurred during the transfer: ${error.message}`);
  }
};

const isAddressValid = (address) => {
  return ethers.utils.isAddress(address);
};

module.exports = {
  transferTokens,
  isAddressValid,
};
