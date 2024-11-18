require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/4cf6fddedfd54da5bde77099cbfc6c41",
    //   accounts: ["pvtKey"]
    // }
  },
  etherscan: {
    apiKey: "NCK76P88P8MFMTQE66ZQ8XKVRAX6337NHC"
  },
  sourcify: {
    enabled: true
  }
};
