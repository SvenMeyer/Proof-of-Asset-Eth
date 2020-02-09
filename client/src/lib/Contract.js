import ProofOfAssetContract from "@/contracts/ProofOfAsset.json";

class Contract {

	static contract = undefined;

	static getAPI(web3) {  // , network_id) {
		if (! this.contract) {
			const address = "0xB67603876B8BAF976Cf521333160B823f4d1715e";
			this.contract = new web3.eth.Contract(ProofOfAssetContract.abi, address); // deployedNetwork && deployedNetwork.address);
		}
		return this.contract;
	}

}

export default Contract;