// Ethereum network configurations

const infuraKey = "fd09fff3423341508083acb38eefb499";

const networks = {
  development: {
    host: "127.0.0.1", // Localhost (default: none)
    port: 8545, // Standard Ethereum port (default: none)
    network_id: "*" // Any network (default: none)
  },

  // Ganache GUI
  ganache_gui: {
    host: "http://127.0.0.1",
    port: 7545,
    // provider: () => new HDWalletProvider(mnemonic_dev, 'http://127.0.0.1:7545'),
    network_id: "5777"
    // shareNonce:false,
    // websockets: true,	// enabled to use the confirmations listener or to hear Events using .on or .once
    // production: true,	// Treats this network as if it was a public net. (default: false)
  },

  kovan: {
    host: "https://kovan.infura.io/v3/" + infuraKey,
    // provider: () => new HDWalletProvider(mnemonic_dev, 'https://kovan.infura.io/v3/' + infuraKey),
    network_id: "*",
    gas: 4500000,
    gasPrice: 25000000000
  }
};

export default networks;
