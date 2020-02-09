/* eslint-disable no-empty */
/* eslint-disable no-empty */
/* eslint-disable no-empty */
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
      <p class="lead">Provide Product Information and define Token mint process:</p>

      <b-form>

        <b-form-group id="input-group-1">

          <b-form-group id="input-group-hash" label-cols-sm="4" label-cols-lg="3" label="File Hash" label-for="hash">
            <b-form-input id="hash" v-model="ipfs_hash" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-product-name" label-cols-sm="4" label-cols-lg="3" label="Product Name" label-for="product-name">
            <b-form-input id="product-name" v-model="form.product_name" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-product-amount" label-cols-sm="4" label-cols-lg="3" label="Product Amount" label-for="product-amount">
            <b-form-input id="product-amount" v-model="form.product_amount" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-token-name" label-cols-sm="4" label-cols-lg="3" label="Token Name" label-for="token-name">
            <b-form-select id="token-name" v-model="form.token_name" :options="token_options"></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-token-amount" label-cols-sm="4" label-cols-lg="3" label="Token Amount" label-for="token-amount">
            <b-form-input id="token-amount" v-model="form.token_amount" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-notes" label-cols-sm="4" label-cols-lg="3" label="MetaData / Notes:" label-for="notes">
            <b-form-input id="notes" v-model="form.notes" required></b-form-input>
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
import {ipfs} from "@/mixins/ipfs";
import LoadMixin from '@/mixins/loader'
import ViewBlockMixin from '@/mixins/viewBlock'

// import networks from '@/lib/global_config';
import ProofOfAssetContract from "@/contracts/ProofOfAsset.json";
import getWeb3 from "@/lib/getWeb3"
// import Contract from "@/lib/Contract"

export default {

  name: 'IPFSUploadRegister',

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
        product_name: "",
        product_amount: 0,
        token_name: null,
        token_amount: 0,
        notes: ""
      },
      token_options: [
        { value: null, text: 'Select a Token to mint' },
        { value: '0x1621aec5d5b2e6ec6d9b58399e9d5253af86df5f', text: 'FOC1 (only kovan testnet)' },
      ],

      networkId   : null,
      deployedNetwork : null,
      contract: null,

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

        if (this.contract) {
          console.log("contract = ", this.contract);

          let price = await this.contract.methods.getPrice().call();
          console.log({price});

          let result  = await this.contract.methods.setPrice(999).send({ from: accounts[0], gas: 50000, gasPrice: 1e6 });
          console.log({result});

          price = await this.contract.methods.getPrice().call();
          console.log({price});

          let n = await this.contract.methods.getNumberOfItems(accounts[0]).call();
          console.log({n});

          let item  = await this.contract.methods.getItemStructByIndex(0).call();
          console.log(item);

          // addItem(string,string,string,uint256,string,address,uint256):

          console.log(
            this.ipfs_hash,
            "ipfs://",
            this.form.product_name,
            parseInt(this.form.product_amount),
            this.form.notes,
            this.form.token_name,
            parseInt(this.form.token_amount)
          );

          result  = await this.contract.methods.addItem(
            this.ipfs_hash,
            "ipfs://",
            this.form.product_name,
            parseInt(this.form.product_amount),
            this.form.notes,
            this.form.token_name,
            parseInt(this.form.token_amount)
          ).send({ from: accounts[0], gas: 1e6, gasPrice: 1e6 });

          console.log({result});

          n = await this.contract.methods.getNumberOfItems(accounts[0]).call();
          console.log({n});

          item  = await this.contract.methods.getItemStructByIndex(n-1).call();
          console.log(item);

        }

      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }

      /*
      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      */
    } // END handleRegister
  },

  mounted() {
    try {
      console.log("IPFSUploadRegister.vue : mounted")
    } catch(err) {
      /* eslint-disable */
    }
  }

}

</script>

<style>

</style>
