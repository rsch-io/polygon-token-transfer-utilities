# Polygon Token Transfer Utilities

This script is designed to transfer ERC-20 tokens from one Ethereum wallet to another on the Polygon network. It reads private keys from a specified JSON file and transfers tokens if the wallet balance is above a certain threshold.

## Features

- Transfer ERC-20 tokens from one wallet to another
- Checks wallet balance before transferring
- Configurable gas limit, gas price, and minimum transfer amount

## Requirements

- Node.js installed
- Polygon (Matic) network RPC URL
- Smart Contract address of the ERC-20 token on Polygon
- Private key file in JSON format

## Installation

1. Clone the repository
2. Install the dependencies:

   ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables in `.env.examle`
4. Create a `private-keys.json` file in the root directory and add the private keys in the following format:

   ```json
    [
       "0x",
       "0x"
    ]
   ```

   Replace the private keys with the actual private keys of the wallets.
5. Run the script:

   ```bash
   npm run start
   ```
