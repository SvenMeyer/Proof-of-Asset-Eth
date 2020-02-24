<template>
  <b-jumbotron>
    <h1>Tokenized Asset Explorer</h1>
    <p class="lead">Assets registered and minted Token (blockchain : Ethereum {{networkName}}) :</p>

    <!--
    <small class="lead text-danger">{{errorMsg}}</small>
    -->

    <b-input-group class="mb-3" prepend="Registrar Ethereum Address">
      <b-form-input
        v-model="owner_address"
        :state="readyToSearch"
        type="text"
        required>
      </b-form-input>
      <b-input-group-append>
        <b-button @click="searchItems" type="button" :disabled="!readyToSearch">Search</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-table bordered striped hover
      :items="items"
    >
    <!-- :fields="fields" -->

      <!-- cell(...) has to be a copy of the value of the header[] mapping table -->

      <template v-slot:cell(mintAmount)="data">
        <span v-html="data.value"></span>
      </template>

      <template v-slot:cell(tokenContractAddress)="data">
        <span v-html="data.value"></span>
      </template>

      <template v-slot:cell(Registrar)="data">
        <span v-html="data.value"></span>
      </template>

      <template v-slot:cell(fileHash)="data">
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
import LoadMixin from '@/mixins/loader'
import ViewBlockMixin from '@/mixins/viewBlock'
import {ipfs, ipfs_view} from "@/mixins/ipfs";

// standard imports
import getWeb3   from "@/lib/getWeb3";
// import ERC20Info from "@/lib/ERC20Info";
import ProofOfAssetMintContract from "@/contracts/ProofOfAssetMint.json";


export default {

  name: 'AssetExplorer',

  // props : ['selectedNetwork'],
  props: {
    selectedNetwork: String,
  },

  mixins: [LoadMixin, ViewBlockMixin, ipfs],

  components: {
    'b-jumbotron': BJumbotron,
    'b-form-input': BFormInput
  },

  data() {
    return {
      mounted:     false,
      web3:        null,
      networkName: '',
      accounts:    [],
      owner_address: null,
      errorMsg: null,
      items: [],
      // fields: [
      //   { key: 'productAmount', label: 'productAmount', class: 'text-right' },
      // ],
    };
  },

  computed: {

    readyToSearch() {
      return (
        this.mounted &&
        this.owner_address &&
        this.web3 &&
        this.web3.utils.isAddress(this.owner_address));
    }

  },

  methods: {

    // works better than build in version to get a fixed number of decimals
    // https://stackoverflow.com/questions/661562/how-to-format-a-float-in-javascript
    toFixed(value, precision) {
      var power = Math.pow(10, precision || 0);
      return String(Math.round(value * power) / power);
    },

    async getNetworkInfo() {
      try {
        this.web3 = await getWeb3();
        console.log("web3 =", this.web3);
        console.log("web3.version = ", this.web3.version);
        console.log("web3.networkVersion =", this.web3.networkVersion);

        this.networkName = await this.web3.eth.net.getNetworkType();
        console.log("this.networkName =", this.networkName);

        console.log("requesting account access");
        this.accounts = await this.web3.eth.getAccounts();
        this.owner_address = this.accounts[0];
        console.log("owner_address =", this.owner_address);
      }
      catch(error) {
        console.log("Could not access accounts. error :", error)
      }
    },

    async searchItems() {
      console.log("searchItems");

      try {
        let error_message;

        if (! this.contract) {
          if (! this.networkId) {
            this.networkId = await this.web3.eth.net.getId();
            console.log("networkId =", this.networkId);
          }
          this.deployedNetworkIDs = Object.keys(ProofOfAssetMintContract.networks);
          console.log("deployedNetworkIDs =", this.deployedNetworkIDs);
          if (this.deployedNetworkIDs.includes(this.networkId.toString())) {
            this.contract = new this.web3.eth.Contract(
              ProofOfAssetMintContract.abi,
              ProofOfAssetMintContract.networks[this.networkId].address
            );
          } else {
            error_message = "Selected network_id is " + this.networkId +
              " which is not in the list of network_ids (" +
              this.deployedNetworkIDs + ") with a deployed contract.\n" +
              "Please select a different network";
            console.log(error_message);
            alert(error_message);
          }
        }

        const header = {
          id             : "ID",
          blockTimestamp : "Time Stamp" ,
          productAmount  : "productAmount" ,
          productName    : "Product Name" ,
          mintAmount     : "mintAmount" ,
          tokenContractAddress  : "tokenContractAddress", // > Token Name
          // tokenMintTx    : "tokenMintTx"
          registrar      : "Registrar" ,
          fileHash       : "fileHash" ,
          // adrCloudStorage: "File Storage Link" , // we will use this for tokenMintTx
          metadata       : "Metadata"
        };


        if (this.contract) {

          console.log("calling : contract.methods.getNumberOfItems()");

          let n = await this.contract.methods.getNumberOfItems(this.owner_address).call();
          console.log("number of items is now : ", n);

          // do not cache - start with an empty table
          this.items = [];

          for (let index = n-1; index >= 0; index--) {
            const item  = await this.contract.methods.getItembyIndex(this.owner_address, index).call();
            console.log("item =", index, item);
            let row = {};

            // get name, symbol, decimals for token from address
            // let token = await ERC20Info.get(this.web3, item.tokenContract); // ***TODO***
            // console.log(item.tokenContract, token);

            let token = {};  // ***TODO***
            token.decimals = 18;
            token.symbol = 'FEC1';
            token.name   = "Iron Ore Token Type 1";

            row[header.id] = item.id;

            row[header.blockTimestamp] = new Date(item.blockTimestamp*1000).toLocaleString(undefined, {dateStyle:'medium',timeStyle:'medium'});

            row[header.productAmount] = item.productAmount / (10 ** 18);

            row[header.productName] = item.productName;

            row[header.mintAmount] = this.toFixed(item.mintAmount / (10 ** token.decimals)); // , token.decimals < 6 ? token.decimals : 6)

            row[header.tokenContractAddress] = "<a href='" + this.hashLink(item.tokenContractAddress, 'address') + "' target='_blank'>"
                                      + token.name + " (" + token.symbol + ")"
                                      + "<br/>" + item.tokenContractAddress + "</a>";

            row[header.registrar] = "<a href='" + this.hashLink(item.registrar, 'address') + "' target='_blank'>" + item.registrar + "</a>";

            row[header.fileHash] = "<a href='" + ipfs_view + item.fileHash + "' target='_blank'>" + item.fileHash + "</a>";

            console.log(index, row);
            this.items.push(row);
          }
        }

      } catch (error) {
        alert("Failed to load web3, accounts, contract or execute contract call. Check console for details.");
        console.error(error);
      }
    },
  },

  mounted() {
    this.mounted = true;
    this.getNetworkInfo();
  }

}
</script>

<style>

</style>
