/* eslint-env node, browser */
/*
export default {
  data() {
    return {
      MSG_VERSION : 1,
    };
  },

  methods: {


const { BN, Long, bytes, units } = require("@zilliqa-js/util");
const MSG_VERSION = 1;
const myGasPrice = units.toQa("1000", units.Units.Li); // Gas Price that will be used by all transactions

class ProofIPFS_API {
  constructor(deployed_contract, chain_id) {
    this.proof_ipfs = deployed_contract;
    this.chain_id = chain_id;
    this.VERSION = bytes.pack(chain_id, MSG_VERSION);

    // amount, gasPrice and gasLimit must be explicitly provided
    this.params_default = {
      version: this.VERSION,
      amount: new BN(0),
      gasPrice: myGasPrice,
      gasLimit: Long.fromNumber(8000)
    };
  }

	// Functions implementing contract interfaces ------------------------------------------------------------

  // get state information from blockchain node - faster than contract transition
  // https://github.com/Zilliqa/Zilliqa-JavaScript-Library/blob/dev/examples/queryState.js

  // receipt = callTx.txParams.receipt
  codeFromReceipt(receipt) {
    let code;
    const p = receipt.event_logs[0].params;
    if (p) {
      // p = [ { vname: 'code', type: 'Uint32', value: '4' } ]
      const c = p.find(o => o.vname == "code");
      if (c) {
        const v = c.value;
        if (v) {
          code = v;
        }
      }
    }
    return code;
  }

  // we need this workaround until getSubState is working on kaya local network
  async contract_getSubState() {
    const full_state = await this.proof_ipfs.getState();
    return full_state;
  }

  async getPrice() {
    let substate = await this.contract_getSubState("price");
    return substate ? parseInt(substate.price) : 0;
  }

  async getBalance() {
    let state = await this.contract_getSubState("_balance");
    return state ? parseInt(state._balance) : 0;
  }

  async getRegistration(ipfs_cid) {
    let reg_info = [];
    if (this.chain_id != 111) {
      // this is for the real Zilliqa test and main blockchain
      let state = await this.proof_ipfs.getSubState("ipfsInventory", [
        ipfs_cid
      ]);
      reg_info = state ? state.ipfsInventory[ipfs_cid].arguments : [];
    } else {
      // workaround to get it to work on kaya local network
      const full_state = await this.proof_ipfs.getState();
      const item = full_state.ipfsInventory.find(o => o.key == ipfs_cid);
      reg_info = item ? item.val.arguments : [];
    }
    return reg_info;
  }
*/

const contract_address = "zil13jjcwrph3zrz04ua45gsz6295wycaa7r5ar4c9"; // testnet

export default {

	contract_address,

  data() {
    return {

    };
  },

  methods: {

		async getItemList(hex_address) {
			console.log("getItemList :")
			const zilliqa = window.zilPay;
			// const { units, BN, Long } = zilliqa.utils;
			// const gasPrice = units.toQa('1000', units.Units.Li);
			this.proof_ipfs = zilliqa.contracts.at(contract_address);
			const a = hex_address.toLowerCase();
			let item_list = [];
			if (this.chain_id != 111) {
				// this is for the real Zilliqa test and main blockchain
				const state = await this.proof_ipfs.getSubState("registered_items", [a]);
				item_list = state ? state.registered_items[a] : [];
			} else {
				// workaround to get it to work on kaya local network
				const full_state = await this.proof_ipfs.getState();
				const ri = full_state.registered_items;
				const reg_info = ri.find(o => o.key == a);
				item_list = reg_info ? reg_info.val : [];
			}
			return item_list;
		},

		async getPrice_fromContract() {
			const callTxGet = await this.proof_ipfs.call(
				"getPrice",
				[],
				this.params_default
			);
			const receipt_get = callTxGet.txParams.receipt;
			const p = receipt_get.event_logs[0].params;
			return p[0]["value"] ? parseInt(p[0]["value"]) : 0;
		},

		// http://bluebirdjs.com/docs/anti-patterns.html
		async setPrice(new_price) {
			return this.proof_ipfs
				.call(
					"setPrice",
					[
						{
							vname: "new_price",
							type: "Uint128",
							value: new_price.toString()
						}
					],
					this.params_default
				)
				.then(callTx => {
					return callTx.txParams.receipt;
				});
		},

		async getPrice() {
			const zilliqa = window.zilPay;
			const proof_ipfs = zilliqa.contracts.at(contract_address);
			const substate = proof_ipfs.getSubState("price");
			return substate.price ? parseInt(substate.price) : 0;
		},

		// call contract transition
		// https://github.com/Zilliqa/Zilliqa-JavaScript-Library/tree/dev/packages/zilliqa-js-contract#calltransition-string-args-value-params-callparams-promisetransaction

		async registerOwnership(ipfs_cid, metadata) {
			console.log("registerOwnership : contract_address =", contract_address)
			const zilliqa = window.zilPay;
			const { units, BN, Long } = zilliqa.utils;
			const myGasPrice = units.toQa('1000', units.Units.Li);

			this.proof_ipfs = zilliqa.contracts.at(contract_address);

			const params_call = [
				{
					vname: "ipfs_cid",
					type: "String",
					value: ipfs_cid
				},
				{
					vname: "metadata",
					type: "String",
					value: metadata
				}
			];

			// amount, gasPrice and gasLimit must be explicitly provided
			const params_default = {
				version: this.VERSION,
				amount: new BN(0),
				gasPrice: myGasPrice,
				gasLimit: Long.fromNumber(8000)
			};

			return this.getPrice().then(price => {
				let params_register = params_default;
				params_register.amount = new BN(price);
				return this.proof_ipfs.call(
					"registerOwnership",
					params_call,
					params_register
				);
			});
		},
	}
}

// module.exports = { ProofIPFS_API, myGasPrice };
// ES6 browser
// export {ProofIPFS_API, myGasPrice};
