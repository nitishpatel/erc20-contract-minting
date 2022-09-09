require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config();

const { MNEMONIC } = process.env;

const sharedNetworkConfig = {
  accounts: {
    mnemonic: MNEMONIC,
  },
};
const namedAccounts = Object.fromEntries(
  [
    "deployer",
  ].map((name, i) => [name, i])
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  namedAccounts,
  networks: {
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://rpc.xinfin.yodaplus.net`,
    },
    apothem: {
      ...sharedNetworkConfig,
      url: "https://rpc-apothem.xinfin.yodaplus.net",
    },
  }
};
