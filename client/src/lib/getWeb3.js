// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
// https://docs.fortmatic.com/web3-integration/web3-provider

import Fortmatic from 'fortmatic';
import Web3 from 'web3';

const fortmatic_api_key_test = "pk_test_F9E4308A49F1BAF7"; // Rinkeby, Kovan, Ropsten
// const fortmatic_api_key_main = undefined;

const getWeb3 = async () => {

	console.log("getWeb3");

	const fm = new Fortmatic(fortmatic_api_key_test);

	let web3 = undefined;

	// Post EIP-1102 update which MetaMask no longer injects web3
	if (window.ethereum) {
		console.log("window.ethereum is defined. Using MetaMask provider");
		web3 = new Web3(window.ethereum);
		try {
			console.log("Requesting account access.");
			await window.ethereum.enable();
			console.log("account access enabled");
		} catch (error) {
			console.log("User denied account access. error =", error);
		}
	} else {
		console.log('No Metamask detected. Using Fortmatic provider.');
		web3 = new Web3(fm.getProvider());
	}

	// Legacy dApp browsers which web3 is still being injected
	if (typeof web3 !== 'undefined') {
		console.log("Legacy dApp browsers detected, using injected web3.");
		web3 = new Web3(web3.currentProvider);
	} else {
		console.log('Non-Ethereum browser detected. Using Fortmatic provider.');
		web3 = new Web3(fm.getProvider());
	}

	return web3;
}

export default getWeb3;
