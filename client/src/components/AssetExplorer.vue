<template>
  <b-jumbotron>
    <h1>Proof of Asset Explorer</h1>
    <p class="lead">List all assets registered by a certain address (selected network = {{selectedNetwork}}) :</p>

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

      <template v-slot:cell(block_number)="block">
        <span v-html="block.value"></span>
      </template>

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
// Vue imports
import {BJumbotron, BFormInput} from 'bootstrap-vue'

// mixins imports
import {ipfs, ipfs_view} from "../mixins/ipfs";
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'

// standard imports
import {Zilliqa} from '@zilliqa-js/zilliqa';
import {networks} from '../lib/global_config';
import {ProofIPFS_API} from '../lib/ProofIPFS_API';


export default {

  name: 'AssetExplorer',

  // props : ['selectedNetwork'],
  props: {
    selectedNetwork: String,
  },

  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin, ipfs],

  components: {
    'b-jumbotron': BJumbotron,
    'b-form-input': BFormInput
  },

  data() {
    return {
      owner_address: null,
      errorMsg: null,
      items: [],

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
      const network = networks[this.selectedNetwork];
      console.log("network.host_url =", network.host_url);
      const zilliqa = new Zilliqa(network.host_url);

      console.log("network.contract_address =", network.contract_address);
      const deployedContract = zilliqa.contracts.at(network.contract_address);
      const chain_id  = network.chain_id;
      console.log({chain_id});
      const prof_ipfs = new ProofIPFS_API(deployedContract, chain_id);

      // this.startLoading('Transaction pending ...');
      const response_items = await prof_ipfs.getItemList(hex_address);
      console.log({response_items});

      const tableRows = response_items.map(i => ({
        Asset_IPFS_Hash : i ,
        asset_serial : "",
        block_number: "",
        time_stamp   : "",
        product_name : "",
        custodian   : "",
        documents: "<a href='" + ipfs_view + i + "' target='_blank'>" + "[Documents Link]" + "</a>"}));

      this.items = tableRows;
      console.log({tableRows})

      this.items.forEach(async row => {
        console.log({row})
        const reg_info = await prof_ipfs.getRegistration(row.Asset_IPFS_Hash);
        console.log({reg_info});
        const blocknumber = reg_info[1];
        const metadata = JSON.parse(reg_info[2]);
        console.log({metadata});
        // const response_blocktime = await this.getBlockTime(blocknumber);
        const response_blocktime = await zilliqa.blockchain.getTxBlock(blocknumber);
        const ms = response_blocktime.result.header.Timestamp;
        row.asset_serial = metadata.asset_serial;
        const block_link = this.explore(blocknumber, 'block');
        row.block_number = "<a href='" + block_link + "' target='_blank'>" + blocknumber + "</a>"
        row.time_stamp   = new Date(Math.round(ms/1000))  // .toISOString();
        row.product_name = metadata.product_name;
        row.custodian    = metadata.custodian;

        console.log({row});
      })

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
