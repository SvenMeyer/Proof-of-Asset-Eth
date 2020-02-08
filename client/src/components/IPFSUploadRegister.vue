<template>
  <b-jumbotron>
    <!--
    <h3>IPFS Upload - Ethereum Blockchain Registration - Token mint</h3>
    <p></p>
    -->
    <p class="lead">Upload document to IPFS:</p>

    <small class="lead text-danger">{{errorMsg}}</small>

		<b-form class="margin-sm" @submit.stop.prevent="handleSubmit">
			<div class="border-style">
				<b-form-file v-model="fileObject" ref="file-input" class="mb-2" autofocus multiple/>
			</div>
			<b-button class="margin-xs" variant="primary" @click="handleOk">
				Upload to IPFS
			</b-button>
		</b-form>


		<div class="mt-5">
			<p class="lead">Document Metadata for Zilliqa Blockchain Registration:</p>

			<b-form>

				<b-form-group id="input-group-1">

					<b-form-group id="input-group-2" label="Asset Hash:" label-for="input-2">
						<b-form-input
							id="input-2"
							v-model="ipfs_hash"
							required
						></b-form-input>
					</b-form-group>

					<b-form-group id="input-group-3" label="Asset Serial:" label-for="input-3">
						<b-form-input
							id="input-3"
							v-model="form.asset_serial"
							required
						></b-form-input>
					</b-form-group>

					<b-form-group id="input-group-4" label="Product Name:" label-for="input-4">
						<b-form-input
							id="input-4"
							v-model="form.product_name"
							required
						></b-form-input>
					</b-form-group>

					<b-form-group id="input-group-5" label="Custodian:" label-for="input-5">
						<b-form-input
							id="input-5"
							v-model="form.custodian"
							required
						></b-form-input>
					</b-form-group>

					<b-button @click="handleRegister" type="button" variant="primary">Register on Blockchain</b-button>

				</b-form-group>

			</b-form>

			<p>txHash    : <b-link :href="explore(txHash)" :disabled="txMessage != 'confirmed'" target="_blank">{{ txHash }}</b-link></p>
      <p>txMessage : {{ txMessage }}</p>

		</div>
  </b-jumbotron>
</template>

<script>
import {BJumbotron, BFormInput} from 'bootstrap-vue'
// mixins
import {ipfs} from "../mixins/ipfs";
// import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'

// standard imports
// import {Zilliqa} from '@zilliqa-js/zilliqa';
import {networks} from '../lib/global_config';
// import {ProofIPFS_API} from '../lib/ProofIPFS_API';

import ProofOfAssetContract from "../contracts/ProofOfAsset.json";
import getWeb3 from "../lib/getWeb3"

export default {

  name: 'AssetExplorer',

  mixins: [LoadMixin, ViewBlockMixin],

  components: {
    'b-jumbotron' : BJumbotron,
    'b-form-input': BFormInput
  },

  data() {
    return {
			show: true,
			fileObject: null,
			ipfs_hash: "",
			form: {
				asset_serial: "",
				product_name: "",
				custodian: "",
			},
			txHash: "",
			txMessage: "",

			owner_address: null,
			errorMsg: null,
      proof_ipfs: null,
      items: [],
    };
  },

  computed: {
    validAddress() {
       return this.owner_address && (this.validateAddress(this.owner_address) !== null);
		},
  },

  methods: {

    handleOk() {
      if (!this.fileObject) {
        alert("Please select a file to upload.");
      } else {
        this.saveToIpfsWithFilename(this.fileObject)
      }
    },

    // Add one file to IPFS and return a CID
    saveToIpfs (file) {
      ipfs.add(file, { progress: (prog) => console.log(`received: ${prog}`) })
        .then((response) => {
          this.ipfs_hash = response[0].hash;
          this.metadata  = "{filename : '" + file.name + "'}";
        }).catch((err) => {
          console.error(err)
        })
    },

    // Add one or multiple files to IPFS and wrap it in a directory to keep the original filename
    saveToIpfsWithFilename (files) {
      const fileDetails = [...files].map(file => ({path: file.name, content: file}));
      const fileNames   = [...files].map(file => (file.name));
      const options = {
        wrapWithDirectory: true,
        progress: (prog) => console.log(`received: ${prog}`)
      }
      ipfs.add(fileDetails, options)
        .then((response) => {
          // CID of wrapping directory is returned last
          this.ipfs_hash = response[response.length - 1].hash
          this.metadata  = JSON.stringify({filenames : fileNames});
        }).catch((err) => {
          console.error(err)
        })
		},

		async handleRegister() {
			console.log("handleRegister : form =", this.form);
			console.log("ipfs_hash =", this.ipfs_hash);
			const metadata = JSON.stringify(this.form);
      console.log("metadata  =", metadata);


      try {
        // Get network provider and web3 instance.
        console.log("getting web3 ...")
        const web3 = await getWeb3();
        console.log({web3});
        console.log("web3.version = ", web3.version);

        // Get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        console.log({accounts});

        // Get the contract
        const networkId = await web3.eth.net.getId();
        console.log({networkId})
        const deployedNetwork = ProofOfAssetContract.networks[networkId];
        console.log({deployedNetwork})
        const contract = new web3.eth.Contract(
          ProofOfAssetContract.abi,  "0xcfd314B14cAB8c3e36852A249EdcAa1D3Dd05055"
          // deployedNetwork &&
          // deployedNetwork.address
        );
        console.log({contract});
        // console.log("this.setState({ web3, accounts, contract });"); // TODO

        // https://ethereum.stackexchange.com/questions/54507/how-to-call-a-deployed-contract-function

        let price = await contract.methods.getPrice().call();
        console.log({price});

        let n = await contract.methods.getNumberOfItems(accounts[0]).call();
        console.log({n});

        let item  = await contract.methods.getItemStructByIndex(0).call();
        console.log(item);

      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }

      /*
      const zilliqa = window.zilPay;
      const zilPayNetwork = zilliqa.wallet.net;
      console.log({zilPayNetwork})
      const network = networks[zilPayNetwork];

      // TODO : set selectedNetwork in NavBar to network

      console.log("network.host_url =", network.host_url);

      console.log("network.contract_address =", network.contract_address);
      const deployedContract = zilliqa.contracts.at(network.contract_address);

      const proof_ipfs = new ProofIPFS_API(deployedContract, network);

			const callTx = await proof_ipfs.registerOwnership(this.ipfs_hash, metadata);

      this.txHash = callTx.TranID;
      console.log("txHash =", JSON.stringify(this.txHash));
      */

      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

			// const zilliqa = window.zilPay;
      const now = Date.now();
      console.log({now});
      let pending = true;
      while (pending) {
        await timeout(2000);

        /*
        zilliqa.blockchain.getTransaction(this.txHash)
        .then(status => {
          console.log("txStatus =", JSON.stringify(status));
          pending = false;
          this.txMessage = (status.receipt.success ? 'confirmed' : 'failed');
        }, reject_status => {
					this.txMessage = Math.round((Date.now() - now)/1000) + ' %';
					console.log({reject_status});
        });
        */

      }
		},

    /*
    observableAccount() {
      setTimeout(() => {
        this.owner_address = window.zilPay.wallet.defaultAccount.bech32;
        window.zilPay.wallet.observableAccount().subscribe(account => {
          this.owner_address = account.bech32;
        });
      }, 1000);
    }
    */

  },

  mounted() {
    try {
      // this.observableAccount();
      console.log("IPFSUploadRegister.vue : mounted")
      console.log(networks.local.host_url);
    } catch(err) {
      /* eslint-disable */
    }
  }
}
</script>

<style>

</style>
