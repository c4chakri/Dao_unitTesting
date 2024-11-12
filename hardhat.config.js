require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
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
    //   url: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  }
};
