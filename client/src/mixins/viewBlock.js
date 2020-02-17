export default {
  data() {
    return {
      linkAddress: "https://" + this.networkName + ".etherscan.io/address/",
      linkTx: "https://" + this.networkName + ".etherscan.io/tx/"
    };
  },
  methods: {
    hashLink(hash, type='tx') {
      if (this.networkName == 'main') {
        return "https://etherscan.io/" + type + '/' + hash;
      } else if (this.networkName)
        return "https://" + this.networkName + ".etherscan.io/" + type + '/' + hash;
      else
        return '';
    },
  }
};