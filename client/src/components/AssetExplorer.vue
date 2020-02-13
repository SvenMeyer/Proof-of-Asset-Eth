<template>
  <b-jumbotron>
    <h1>Proof of Asset Explorer</h1>
    <p class="lead">List of all assets registered by a certain address (selected network = {{selectedNetwork}}) :</p>

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
        <b-button @click="searchItems" type="button" variant="primary" :disabled="!readyToSearch">Search</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-table bordered striped hover :items="items">

      <template v-slot:cell(block_number)="block">
        <span v-html="block.value"></span>
      </template>

      <template v-slot:cell(mintAmount)="data">
        <span v-html="data.value"></span>
      </template>

      <template v-slot:cell(tokenContract)="data">
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
import getWeb3 from "@/lib/getWeb3";
import ProofOfAssetContract from "@/contracts/ProofOfAsset.json";

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
      mounted: false,
      web3: null,
      owner_address: null,
      errorMsg: null,
      items: [],

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

    async searchItems() {
      console.log("searchItems");

      try {
        let error_message;

        if (! this.contract) {
          if (! this.networkId) {
            this.networkId = await this.web3.eth.net.getId();
            console.log("networkId =", this.networkId);
          }
          this.deployedNetworkIDs = Object.keys(ProofOfAssetContract.networks);
          console.log("deployedNetworkIDs =", this.deployedNetworkIDs);
          if (this.deployedNetworkIDs.includes(this.networkId.toString())) {
            this.contract = new this.web3.eth.Contract(
              ProofOfAssetContract.abi,
              ProofOfAssetContract.networks[this.networkId].address
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
          productAmount  : "Amount" ,
          productName    : "Product Name" ,
          mintAmount     : "mintAmount" ,
          tokenContract  : "tokenContract", // > Token Name
          // tokenTxHash    : "tokenTxHash"
          // registrar      : "Registrar" ,
          fileHash       : "fileHash" ,
          // adrCloudStorage: "File Storage Link" ,
          metadata       : "Metadata"
        };


        if (this.contract) {
          console.log("calling : contract.methods.getNumberOfItems()");

          // do not cache - start with an empty table
          this.items = [];

          let n = await this.contract.methods.getNumberOfItems(this.owner_address).call();
          console.log("number of items is now : ", n);

          for (let index = n-1; index >= 0; index--) {
            const item  = await this.contract.methods.getItembyIndex(this.owner_address, index).call();
            console.log("item =", index, item);
            let row = {};

            row[header.id] = item.id;

            row[header.blockTimestamp] = new Date(item.blockTimestamp*1000).toLocaleString(undefined, {dateStyle:'medium',timeStyle:'medium'});

            row[header.productAmount] = item.productAmount;

            row[header.productName] = item.productName;

            row[header.mintAmount] = "<a href='" + "LINK-TxMintHash" + "' target='_blank'>" + item.mintAmount + "</a>";

            row[header.tokenContract] = "<a href='" + item.tokenContract + "' target='_blank'>" + item.tokenContract + "</a>";

            row[header.fileHash] = "<a href='" + ipfs_view + item.fileHash + "' target='_blank'>" + item.fileHash + "</a>";

            // row.documents = "<a href='" + ipfs_view + item.fileHash + "' target='_blank'>" + "[Documents]" + "</a>";

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
    try {
      // this.observableAccount();
              // Get network provider and web3 instance.
        console.log("getting web3 ...")

        getWeb3()
        .then(_web3 => {
          this.web3 = _web3;
          console.log("web3 =", this.web3);
          console.log("web3.version = ", this.web3.version);
          console.log("web3.networkVersion =", this.web3.networkVersion);
          console.log("requesting account access");
          this.web3.eth.getAccounts();
        })
        .then(accounts => {
            this.owner_address = accounts[0];
            console.log("owner_address =", this.owner_address);
        })
        .catch(error => {
          console.log("Could not access accounts. error :", error)
        })
    } catch(err) {
      /* eslint-disable */
    }
  }
}
</script>

<style>

</style>
