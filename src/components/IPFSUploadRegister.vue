<template>
  <b-jumbotron>
    <h1>IPFS Upload &amp; Zilliqa Registration</h1>
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

					<b-button @click="handleRegister" type="button" variant="primary">Register on Zilliqa</b-button>

				</b-form-group>

			</b-form>

			<p>txHash    : <b-link :href="explore(txHash)" :disabled="txMessage != 'confirmed'" target="_blank">{{ txHash }}</b-link></p>
      <p>txMessage : {{ txMessage }}</p>

		</div>

    <!--
    <b-modal :ref="isDeploy"
             hide-footer
             title="Contract created">
      <h6>Contract:
        <a :href="explore(contract.ContractAddress, 'address')"
           class="text-info"
           target="_blank">{{contract.ContractAddress}}</a>
      </h6>
      <h6>owner:
        <a :href="explore(contract.owner, 'address')"
           class="text-info"
           target="_blank">{{contract.owner}}</a></h6>
      <a class="btn btn-info"
         :href="explore(contract.id)"
         target="_blank">show on ViewBlock</a>
      <hr>
      <tree-view :data="contract.init" :options="treeViewOptions"></tree-view>
    </b-modal>
    -->

  </b-jumbotron>
</template>

<script>
import {BJumbotron, BFormInput} from 'bootstrap-vue'
// mixins
import {ipfs} from "../mixins/ipfs";
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'
import ProofIPFS_API_mixin from '../mixins/ProofIPFS_API_mixin'


export default {
  name: 'AssetExplorer',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin, ProofIPFS_API_mixin],
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

			const callTx = await this.registerOwnership(this.ipfs_hash, metadata);

      this.txHash = callTx.TranID;
      console.log("txHash =", JSON.stringify(this.txHash));

      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

			const zilliqa = window.zilPay;
      const now = Date.now();
      let pending = true;
      while (pending) {
        await timeout(2000);

        zilliqa.blockchain.getTransaction(this.txHash)
        .then(status => {
          console.log("txStatus =", JSON.stringify(status));
          pending = false;
          this.txMessage = (status.receipt.success ? 'confirmed' : 'failed');
        }, reject_status => {
					this.txMessage = Math.round((Date.now() - now)/1000) + ' %';
					console.log({reject_status});
        });
      }
		},


/*
      try {
        this.contract = await this.deployFungibleToken(
          this.owner_address,
          this.form.totalSupply,
          this.form.decimals,
          this.form.name,
          this.form.symbol
        );
        await this.txObservable(this.contract.id);
        this.$refs[this.isDeploy].show();
      } catch(err) {
        this.errorMsg = err.message || err;
      }
*/


    observableAccount() {
      setTimeout(() => {
        this.owner_address = window.zilPay.wallet.defaultAccount.bech32;
        window.zilPay.wallet.observableAccount().subscribe(account => {
          this.owner_address = account.bech32;
        });
      }, 1000);
    }

  },

  mounted() {
    try {
      this.observableAccount();
    } catch(err) {
      /* eslint-disable */
    }
  }
}
</script>

<style>

</style>
