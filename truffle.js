// Allows us to use ES6 in our migrations and tests.
require('babel-register')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    ropsten: {
      provider: function () {
        return new HDWalletProvider('laugh combine urge type harvest story enemy drip real word agree basic', 'https://ropsten.infura.io/v3/91a0fbe4407c4b7c97b3f4e29423d8a9')
      },
      network_id: 3,
      gas: 6000000,
      gasPrice: 10000000000
    }
  }
}
