<template>
  <b-jumbotron>
    <h1>Proof of Asset Explorer</h1>
    <p class="lead">List all assets registered by a certain address:</p>

    <small class="lead text-danger">{{errorMsg}}</small>

    <b-input-group class="mb-3" prepend="Zil Address">
      <b-form-input
        v-model="owner_address"
        :state="validAddress"
        type="text"
        required>
      </b-form-input>
      <b-input-group-append>
        <b-button @click="searchItems" type="button" variant="primary">Search</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-table bordered striped hover :items="items">

      <template v-slot:cell(documents)="data">
        <span v-html="data.value"></span>
      </template>

    </b-table>


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
import {ipfs, ipfs_view} from "../mixins/ipfs";
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'
import ProofIPFS_API_mixin from '../mixins/ProofIPFS_API_mixin'


export default {
  name: 'AssetExplorer',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin, ProofIPFS_API_mixin, ipfs],
  components: {
    'b-jumbotron': BJumbotron,
    'b-form-input': BFormInput
  },

  data() {
    return {
      owner_address: null,
      errorMsg: null,
      // proof_ipfs: null,
      items: [],
      // ipfs_node: 'localhost',
      // ipfs_view: 'http://localhost:1111/ipfs/',  // 'https://ipfs.io/ipfs/',
    };
  },

  computed: {
    validAddress() {
       return this.owner_address && (this.validateAddress(this.owner_address) !== null);
    }
  },

  methods: {

    async searchItems() {
      this.errorMsg = null;
      const hex_address = this.validateAddress(this.owner_address);
      console.log("this.owner_address =", hex_address);

      // this.startLoading('Transaction pending ...');
      const result = await this.getItemList(hex_address);
      console.log({result});
      const tableRows = result.map(i => ({'Asset IPFS Hash' : i , documents: "<a href='" + ipfs_view + i + "' target='_blank'>" + "[Documents Link]" + "</a>"}));
      // const tableRows = result.map(i => ({'Asset IPFS Hash' : i}));
      console.log(tableRows)
      this.items = tableRows;
      // this.endLoading();
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
