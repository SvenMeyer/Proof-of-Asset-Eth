<template>
  <b-jumbotron>
    <h1>IPFS Upload &amp; Zilliqa Registration</h1>
    <p class="lead">Upload document to IPFS:</p>

    <small class="lead text-danger">{{errorMsg}}</small>

		<b-form-file v-model="file" ref="file-input" class="mb-2" autofocus multiple></b-form-file>



		<div class="mt-5">
			<!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
			<b-form>

				<b-form-group id="input-group-1">

					<b-form-group id="input-group-2" label="Asset Hash:" label-for="input-2">
						<b-form-input
							id="input-2"
							v-model="form.asset_hash"
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

					<b-button @click="register" type="button" variant="primary">Submit</b-button>

				</b-form-group>

			</b-form>

			<b-card class="mt-3" header="Form Data Result">
				<pre class="m-0">{{ form }}</pre>
			</b-card>

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
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'
import ProofIPFS_API_mixin from '../mixins/ProofIPFS_API_mixin'


export default {
  name: 'AssetExplorer',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin, ProofIPFS_API_mixin],
  components: {
    'b-jumbotron': BJumbotron,
    'b-form-input': BFormInput
  },

  // props: [contract_address],

  data() {
    return {
			show: true,
			form: {
				asset_hash: "",
				asset_serial: "",
				product_name: "",
				custodian: "",
			},

			owner_address: null,
			errorMsg: null,
      // contract: {},
      contract_address: "zil13jjcwrph3zrz04ua45gsz6295wycaa7r5ar4c9", // testnet
      proof_ipfs: null,
      items: [],
      ipfs_node: 'localhost:5001',
      ipfs_view: 'http://localhost:1111/ipfs/',  // 'https://ipfs.io/ipfs/',
    };
  },

  computed: {
    validAddress() {
       return this.owner_address && (this.validateAddress(this.owner_address) !== null);
    }
  },

  methods: {

		async register() {
			console.log("register : form =", this.form);
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
