<template>
  <b-jumbotron>
    <!--
    <h3>IPFS Upload - Ethereum Blockchain Registration - Token mint</h3>
    <p></p>
    -->
    <p class="lead">Upload document file:</p>
    <!--
    <small class="lead text-danger">{{errorMsg}}</small>
    -->

    <b-form class="margin-sm" @submit.stop.prevent="handleSubmit">
      <div class="border-style">
        <b-form-file v-model="fileObject" ref="file-input" class="mb-2" autofocus multiple/>
      </div>
      <b-button class="margin-xs" @click="handleOk" :disabled="!fileObject">
        Upload to IPFS
      </b-button>
    </b-form>

    <div class="mt-5">
      <p class="lead">Provide Product Information and define Token mint process:</p>

      <b-form>

        <b-form-group id="input-group-1">

          <b-form-group id="input-group-hash" label-cols-sm="4" label-cols-lg="3" label="File Hash" label-for="hash">
            <b-form-input
              id="hash"
              v-model="ipfs_hash"
              type="text"
              :state="validHash"
              required>
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-product-name" label-cols-sm="4" label-cols-lg="3" label="Product Name" label-for="product-name">
            <b-form-input
              id="product-name"
              v-model="form.product_name"
              type="text"
              :state="validProductName"
              required>
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-product-amount" label-cols-sm="4" label-cols-lg="3" label="Product Amount" label-for="product-amount">
            <b-form-input
              id="product-amount"
              v-model="form.product_amount"
              type="number"
              :state="validProductAmount"
              required>
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-token-name" label-cols-sm="4" label-cols-lg="3" label="Token Name" label-for="token-name">
            <b-form-select
              id="token-name"
              v-model="form.token_index"
              :options="token_options"
              :state="validToken"
            >
            </b-form-select>
          </b-form-group>

          <b-form-group id="input-group-token-amount" label-cols-sm="4" label-cols-lg="3" label="Token Amount" label-for="token-amount">
            <b-form-input
              id="token-amount"
              v-model="form.token_amount"
              type="number"
              :state="validTokenAmount"
              required>
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-metadata" label-cols-sm="4" label-cols-lg="3" label="Metadata:" label-for="metadata">
            <b-form-input
              id="metadata"
              v-model="form.metadata"
              type="text">
            </b-form-input>
          </b-form-group>

          <b-button @click="handleRegister" type="button" :disabled="!validForm">Register on Blockchain</b-button>

        </b-form-group>

      </b-form>

      <p class="text-monospace">Tx Hash : <b-link :href=txHashPOALink :disabled="!txHashPOA" target="_blank">{{ txHashPOA }}</b-link></p>
      <p class="text-monospace">validForm = {{ validForm }}</p>

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
import ProofOfAssetMintContract from "@/contracts/ProofOfAssetMint.json";
// import FECoinContract       from "@/contracts/FECoin.json";
import getWeb3   from "@/lib/getWeb3"
import MathUtils from "@/lib/MathUtils.mjs"
// import ERC20Info from "@/lib/ERC20Info";

import * as token_config from "@/config.json";  // copy of 0x-launch-kit-frontend/src/config.json

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
        token_index : null,
        token_amount: 0,
        metadata: ""
      },

      token_options: [
        { value: null, text: 'Select a Token to mint' },
      ],

      token_config: null,

      networkId   : null,  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
      networkName : null,
      deployedNetwork : null,
      contract: null,
      result: null,
      txHashPOA: null,
      txMessage: null,

      txHashMint: null,

      items: [],
    };
  },

  computed: {

    validHash() {
      return this.ipfs_hash.length >= 16;
    },

    validProductName() {
      return this.form.product_name.length > 0;
    },

    validProductAmount() {
      // return this.form.product_amount > 0;
      return !isNaN(parseFloat(this.form.product_amount)) && isFinite(this.form.product_amount) && (parseFloat(this.form.product_amount) > 0)
    },

    validToken() {
      // if form.token_amount == 0 then we do not have to select a token
      return (this.form.token_index != null || (parseFloat(this.form.token_amount) == 0)) ? null : false;
    },

    validTokenAmount() {
      // return this.form.token_amount > 0;
      return (!isNaN(parseFloat(this.form.token_amount)) && isFinite(this.form.token_amount) && (parseFloat(this.form.token_amount) >= 0)) ? null : false;
    },

    validForm() {
      return this.validHash && this.validProductName && this.validProductAmount && (this.validToken != false);
    },

    validAddress() {
       return this.owner_address && (this.validateAddress(this.owner_address) !== null);
    },

    // Is there a better solution? Computed with parameter would be nice
    // https://stackoverflow.com/questions/40522634/can-i-pass-parameters-in-computed-properties-in-vue-js

    txHashMintLink() {
      if (this.networkName == 'main') {
        return "https://etherscan.io/tx/" + this.txHashMint;
      } else if (this.networkName)
        return "https://" + this.networkName + ".etherscan.io/tx/" + this.txHashMint;
      else
        return '';
    },

    txHashPOALink() {
      if (this.networkName == 'main') {
        return "https://etherscan.io/tx/" + this.txHashPOA;
      } else if (this.networkName)
        return "https://" + this.networkName + ".etherscan.io/tx/" + this.txHashPOA;
      else
        return '';
    }

  },

  methods: {

    // handle [Upload to IPFS] button
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

      try {
        // mint token
        console.log("token =", this.form.token_index);
        // Get network provider and web3 instance.
        console.log("getting web3 ...")
        const web3 = await getWeb3();
        console.log({web3});
        console.log("web3.version = ", web3.version);
        console.log("web3.networkVersion =", web3.networkVersion);

        if (! this.networkId) {
          this.networkId = await web3.eth.net.getId();
          console.log("networkId =", this.networkId);
        }

        if (! this.networkName) {
          this.networkName = await await web3.eth.net.getNetworkType();
          console.log("networkName =", this.networkName);
          console.log("web3.version.network =", web3.version.network)
        }

        console.log("this.form.token_index =", this.form.token_index)
        console.log("token_config.tokens =", token_config.tokens)
        // let token_contract_address = token_config.tokens[this.form.token_index].addresses[this.networkId];
        // console.log({token_contract_address});
/*
        let token_contract = new web3.eth.Contract(FECoinContract.abi, token_contract_address);
        console.log({token_contract})
        // let token_name  = await token_contract.methods.name().call();
        let token = await ERC20Info.get(web3, token_contract_address);



        console.log("minting", this.form.token_amount, token.name + ' (' + token.symbol + ") with " + token.decimals + " for", accounts[0]);
        console.log(token);
        let balance = await token_contract.methods.balanceOf(accounts[0]).call();
        let token_amount_int = parseFloat(this.form.token_amount) * (10 ** token.decimals);
        console.log("balance =", balance);
        let result_mint = await token_contract.methods.mint(accounts[0], token_amount_int.toString())
          .send({ from: accounts[0], gas: 1e6, gasPrice: 1e6 });
        console.log({result_mint})
        this.txHashMint = result_mint.transactionHash;
        balance = await token_contract.methods.balanceOf(accounts[0]).call();
        console.log("balance =", balance);

        console.log("end mint ---------------------------")
*/
        const accounts = await web3.eth.getAccounts();

        let error_message;

        if (! this.contract) {
          if (! this.networkId) {
            this.networkId = await web3.eth.net.getId();
            console.log("networkId =", this.networkId);
          }
          this.deployedNetworkIDs = Object.keys(ProofOfAssetMintContract.networks);
          console.log("deployedNetworkIDs =", this.deployedNetworkIDs);
          if (this.deployedNetworkIDs.includes(this.networkId.toString())) {
            this.contract = new web3.eth.Contract(
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

        if (this.contract) {
          console.log("contract =", this.contract);
          let owner = await this.contract.methods.owner().call();
          console.log("owner =", owner);
          console.log("accounts[0] =", accounts[0])

          let tokenContract = await this.contract.methods.tokenContract().call();
          console.log({tokenContract})
          console.log("tokenContract._address =", tokenContract._address)

          let product_amount_String = MathUtils.uint_fixedPoint_fromFloatSting(this.form.product_amount.toString(), 18);
          let token_amount_String   = MathUtils.uint_fixedPoint_fromFloatSting(this.form.token_amount.toString(), 18);

          console.log("calling : contract.methods.addItem()");
          console.log("-----------------------------------------");
          console.log("this.ipfs_hash         :", this.ipfs_hash)
          console.log({product_amount_String});
          console.log("this.form.product_name :", this.form.product_name)
          console.log({token_amount_String});
          console.log("this.form.metadata     :", this.form.metadata)
          console.log("-----------------------------------------");

          /*
          function addItem(
              string memory _fileHash,
              uint   _productAmount,
              string memory _productName,
              uint    _mintAmount,
              string memory _metadata)
          */

          this.result  = await this.contract.methods.addItem(
            this.ipfs_hash,
            product_amount_String,
            this.form.product_name,
            token_amount_String,
            this.form.metadata,
          ).send({ from: accounts[0], gas: 4e6, gasPrice: 1e6 });

          console.log("result =", this.result);
          this.txHashPOA = this.result.transactionHash;

          this.contract.methods.getNumberOfItems(accounts[0]).call().then(n => {
            console.log("number of items is now : ", n) ;
            return this.contract.methods.getItemStructByIndex(n-1).call(); })
          .then(item =>
            console.log("new entry =", item));
        }

      } catch (error) {
        alert("Failed to load web3, accounts, contract or execute contract call. Check console for details.");
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
      console.log("IPFSUploadRegister.vue : mounted");
      console.log(token_config);
      token_config.tokens.forEach((token, index) => {
        this.token_options.push({value: index, text: token.symbol + " - " + token.name})
      });
      console.log("token_options =", this.token_options);
    } catch(err) {
      /* eslint-disable */
    }
  }

}

</script>

<style>
</style>
