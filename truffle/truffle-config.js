const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {

  contracts_build_directory: "../client/src/contracts",
  networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://goerli.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 5,
    },
    MATIC_MUMBAI: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://polygon-mumbai.g.alchemy.com/v2/${process.env.API_KEY}`)
      },
      network_id: 80001,
    },
    ARBITRUM_GOERLI: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://arb-goerli.g.alchemy.com/v2/${process.env.ARBITRUM_API_KEY}`)
      },
      network_id: 421613,
    },
    OPTIMISM_GOERLI: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://opt-goerli.g.alchemy.com/v2/${process.env.OPTIMISM_API_KEY}`)
      },
      network_id: 42161,
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 10000
        },
        //evmVersion: "byzantium"
      }
    }
  }
}
