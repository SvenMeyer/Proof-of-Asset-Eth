'use strict';

import ERC20Detailed from "@/contracts/ERC20Detailed.json";

// static contract = undefined;

class ERC20Info {

	static token_contracts = {};

	static async get(web3, token_contract_address) {  // , network_id) {
		// check if we have cached information for the given address
		if (! this.token_contracts[token_contract_address]) {
			this.token_contracts[token_contract_address] = { contract : new web3.eth.Contract(ERC20Detailed.abi, token_contract_address) };
			this.token_contracts[token_contract_address].name     = await this.token_contracts[token_contract_address].contract.methods.name().call();
			this.token_contracts[token_contract_address].symbol   = await this.token_contracts[token_contract_address].contract.methods.symbol().call();
			this.token_contracts[token_contract_address].decimals = await this.token_contracts[token_contract_address].contract.methods.decimals().call();
		}
		return this.token_contracts[token_contract_address];
	}

}

export default ERC20Info;