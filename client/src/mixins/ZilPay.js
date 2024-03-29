export default {
  data() {
    return {
      code: {
        notZilPay: 'isZilPay',
        notEnable: 'isEnable',
        notConnect: 'notConnect'
      },
    };
  },

  methods: {

    validateAddress(address) {
      const zilliqa = window.zilPay;
      const { validation } = zilliqa.utils;
      const {
        decodeBase58,
        toChecksumAddress,
        fromBech32Address,
        // isValidChecksumAddress
      } = zilliqa.crypto;

      if (validation.isBech32(address)) {
        return fromBech32Address(address) }
      else if (validation.isBase58(address)) {
        return decodeBase58(address) }
      else if (validation.isAddress(address)) {
        return toChecksumAddress(address) }
      else
        return null;
    },

    zilpayTest() {
      if (typeof window.zilPay === 'undefined') {
        return this.code.notZilPay;
      } else if (!window.zilPay.wallet.isEnable) {
        return this.code.notEnable;
      } else if (!window.zilPay.wallet.isConnect) {
        return this.code.notConnect;
      }

      return true;
    },

    async deployFungibleToken(owner, totalTokens, decimals, name, symbol) {
      const zilliqa = window.zilPay;
      const { units, Long } = zilliqa.utils;
      const { toBech32Address } = zilliqa.crypto;
      const code = window.code;

      owner = this.validateAddress(owner);

      const init = [
        {
            "vname": "_scilla_version",
            "type": "Uint32",
            "value": "0"
        },
        {
            "vname": "owner",
            "type": "ByStr20",
            "value":  owner
        },
        {
          "vname": "total_tokens",
          "type": "Uint128",
          "value": totalTokens
        },
        {
          "vname": "decimals",
          "type": "Uint32",
          "value": decimals
        },
        {
            "vname": "name",
            "type": "String",
            "value": name
        },
        {
            "vname": "symbol",
            "type": "String",
            "value": symbol
        }
      ];
      const contract = zilliqa.contracts.new(code, init);
      const myGasPrice = units.toQa('1500', units.Units.Li);
      const [deployTx, newContract] = await contract.deploy({
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(10000)
      });

      return {
        init,
        ContractAddress: toBech32Address(newContract.address),
        owner: toBech32Address(deployTx.from),
        id: deployTx.TranID
      };
    },

    async txObservable(id) {
      return new Promise(resolve => {
        const zilliqa = window.zilPay;

        const obs = setInterval(() => {
          zilliqa.blockchain
                 .getTransaction(id)
                 .then(tx => {
                  resolve(tx);
                  clearInterval(obs);
                 })
                 .catch();
        }, 3000);
      });
    },

    async contractInfo(address) {
      const zilliqa = window.zilPay;

      address = this.validateAddress(address);
      address = address.replace('0x', '');

      const init = await zilliqa.blockchain.getSmartContractInit(address);
      const state = await zilliqa.blockchain.getSmartContractState(address);

      if (!init.result || !state.result) {
        throw new Error('Wrong contract address');
      }

      return {
        init: init.result,
        state: state.result
      };
    },

  }
};