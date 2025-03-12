require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.21", // or "0.8.28" depending on your requirements
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.INFURA_API_KEY}`, // Correct way to use your Infura API key
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Correctly use the private key from the .env file
    },
  },
};
