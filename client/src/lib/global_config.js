// global configuration defaults for Zilliqa Blockchain network

// [host_url, chain_id, contract_address, private_key, account_address, timeout_deploy, timeout_transition]
const networks = {
	local : {
		host_url : 'http://localhost:7545',
		chain_id  : 5777,
		contract_address : '',
		private_key : '',
		account_address : '',
		timeout_deploy     : 10000,
		timeout_transition :  5000,
	},
	testnet  : {
		host_url : '',
		chain_id  : 42,
		contract_address : 'zil1eamq2aakvhydtzc7yew22qdt400t7mc4wmykqa',
		private_key : '',
		account_address : 'zil1pw587sm57lvlu0wlwkc3gw2sddy35au6esw589', // '0x0bA87F4374F7d9fe3ddf75b11439506b491A779a',
		timeout_deploy     : 180000,
		timeout_transition : 180000,
	},
	mainnet  : {
		host_url : '',
		chain_id  : 1,
		contract_address : '',
		private_key : '',
		account_address : 'zil1pw587sm57lvlu0wlwkc3gw2sddy35au6esw589', // '0x0bA87F4374F7d9fe3ddf75b11439506b491A779a',
		timeout_deploy     : 180000,
		timeout_transition : 180000,
	},
};

export {networks}
