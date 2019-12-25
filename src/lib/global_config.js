// global configuration defaults for Zilliqa Blockchain network

// [host_url, chain_id, contract_address, private_key, account_address, timeout_deploy, timeout_transition]
const networks = {
	local : {
		host_url : 'http://localhost:4200',
		chain_id  : 111,
		contract_address : '',
		private_key : 'db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3',
		account_address : '0x7bb3b0e8a59f3f61d9bff038f4aeb42cae2ecce8',
		timeout_deploy     : 10000,
		timeout_transition :  5000,
	},
	testnet  : {
		host_url : 'https://dev-api.zilliqa.com',
		chain_id  : 333,
		contract_address : 'zil1eamq2aakvhydtzc7yew22qdt400t7mc4wmykqa',
		private_key : '',
		account_address : 'zil1pw587sm57lvlu0wlwkc3gw2sddy35au6esw589', // '0x0bA87F4374F7d9fe3ddf75b11439506b491A779a',
		timeout_deploy     : 180000,
		timeout_transition : 180000,
	},
	mainnet  : {
		host_url : 'https://api.zilliqa.com',
		chain_id  : 1,
		contract_address : '',
		private_key : '',
		account_address : 'zil1pw587sm57lvlu0wlwkc3gw2sddy35au6esw589', // '0x0bA87F4374F7d9fe3ddf75b11439506b491A779a',
		timeout_deploy     : 180000,
		timeout_transition : 180000,
	},
};

const MSG_VERSION = 1;
const VERSION = 1; // bytes.pack(chain_id, MSG_VERSION);

export {networks, MSG_VERSION, VERSION}
