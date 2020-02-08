<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark">

      <b-navbar-brand href="#">Proof-of-Asset &amp; Token mint</b-navbar-brand>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown :text=selectedNetwork right>
          <b-dropdown-item
            v-for="network in networks"
            :key="network"
            :active="network === selectedNetwork"
            href="#"
            @click="setNetwork(network)"
          >{{ network }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-navbar>

    <!-- --------------------------------------------------------------------- -->

    <b-container fluid>

      <b-tabs content-class="mt-0" align="center">
        <b-tab title="IPFS upload &amp; Registration" class="mx-auto" style="width: 896px;" active>
          <ipfs-upload-register/>
        </b-tab>
        <b-tab title="Asset Explorer">
          <asset-explorer :selectedNetwork="selectedNetwork"/>
        </b-tab>
      </b-tabs>

    </b-container>
  </div>
</template>

<script>
import IPFSUploadRegister from './components/IPFSUploadRegister'
import AssetExplorer from './components/AssetExplorer'
// import ZilPayMixin from './mixins/ZilPay'
import LoadMixin from './mixins/loader'

// import ProofOfAssetContract from "./contracts/ProofOfAsset.json";
// import getWeb3 from "./lib/getWeb3";

export default {
  name: 'app',
  mixins: [LoadMixin],
  components: {
    'ipfs-upload-register': IPFSUploadRegister,
    'asset-explorer':    AssetExplorer,
  },

  data() {
    return {
      selectedNetwork: "testnet",
      networks: ["mainnet", "testnet", "private"],
    };
  },

  methods: {
    setNetwork(new_network) {
      this.selectedNetwork = new_network;
    }
  },


  mounted() {

    /*
    window.addEventListener("load", async () => {

*/
  this.endLoading();
  console.log("App.vue : mounted");


  }
}
</script>


<style>

</style>