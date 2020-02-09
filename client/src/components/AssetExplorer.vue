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
      console.log("searchItems");

      try {
        let error_message;
        // Get network provider and web3 instance.
        console.log("getting web3 ...")
        const web3 = await getWeb3();
        console.log({web3});
        console.log("web3.version = ", web3.version);
        console.log("web3.networkVersion =", web3.networkVersion);

        // Get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        console.log({accounts});
        this.owner_address = accounts[0];

        if (! this.contract) {
          if (! this.networkId) {
            this.networkId = await web3.eth.net.getId();
            console.log("networkId =", this.networkId);
          }
          this.deployedNetworkIDs = Object.keys(ProofOfAssetContract.networks);
          console.log("deployedNetworkIDs =", this.deployedNetworkIDs);
          if (this.deployedNetworkIDs.includes(this.networkId.toString())) {
            this.contract = new web3.eth.Contract(
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

        const keys = [
          { blockTimestamp : "Time Stamp" },
          { productAmount  : "Product Amount" },
          { mintAmount     : "Token Amount" },
          { tokenContract  : "tokenContract"},
          { registrar      : "Registrar" },
          { fileHash       : "File Hash" },
          { adrCloudStorage: "File Storage Link" },
          { productName    : "Product Name" },
          { metadata       : "Metadata" }
        ];

        if (this.contract) {
          console.log("calling : contract.methods.getNumberOfItems()");

          let n = await this.contract.methods.getNumberOfItems(accounts[0]).call();
          console.log("number of items is now : ", n);

          let item  = await this.contract.methods.getItemStructByIndex(n-1).call();
          console.log(item);

          let row = {}
          for (let i=0; i < keys.length; i++) {
            let key = Object.keys(keys[i])

            let k = key[0];
            console.log("k =", k);
            row[k] = item[k];
            console.log(k, item[k])
          }
          row.documents = "<a href='" + ipfs_view + item.hash + "' target='_blank'>" + "[Documents]" + "</a>";
          console.log(row);
          this.items.push(row);
        }

      } catch (error) {
        alert("Failed to load web3, accounts, contract or execute contract call. Check console for details.");
        console.error(error);
      }
    },
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
