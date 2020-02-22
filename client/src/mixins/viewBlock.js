export default {
  data() {
    return {
      linkAddress: "https://" + this.networkName + ".etherscan.io/address/",
      linkTx: "https://" + this.networkName + ".etherscan.io/tx/"
    };
  },
  methods: {
    hashLink(hash, type='tx') {
      if (this.networkName == 'main')
        return "https://etherscan.io/" + type + '/' + hash;
      if (this.networkName == 'private')
        return "http://localhost:3000/" + type + '/' + hash;
      if (this.networkName)
        return "https://" + this.networkName + ".etherscan.io/" + type + '/' + hash;
      return '';
    },
  }
};