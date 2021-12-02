/** @format */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString().trim();
const infuraId = fs.readFileSync(".infuraid").toString().trim();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      // Infura
      url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
      accounts: [privateKey],
    },

    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      accounts: [privateKey],
    },
  },

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: "V43KNTFBPTP7RYM7UGE8G7J87Q58HTXYII",
  },
};
