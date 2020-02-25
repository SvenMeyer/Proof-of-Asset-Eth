<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark">

      <b-navbar-brand href="#">Proof-of-Asset &amp; Tokenization</b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="http://fecoin.exchange/" target='_blank'>[FECoin.exchange]</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <!--
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
      -->
    </b-navbar>

    <!-- --------------------------------------------------------------------- -->

    <b-container fluid>

      <b-tabs content-class="mt-0" align="center">

        <b-tab title="Proof-of-Asset &amp; Tokenization"
          class="mx-auto"
          style="width: 896px;"
          :title-link-class="['bg-secondary', 'text-light']"
        active>
          <ipfs-upload-register/>
        </b-tab>

        <b-tab title="Tokenized Asset Explorer"
          :title-link-class="['bg-secondary', 'text-light']"
        lazy>
          <asset-explorer :selectedNetwork="selectedNetwork"/>
        </b-tab>

      </b-tabs>

    </b-container>
  </div>
</template>

<script>
import IPFSUploadRegister from '@/components/IPFSUploadRegister'
import AssetExplorer from '@/components/AssetExplorer'
import LoadMixin from '@/mixins/loader'
import networks from '@/lib/global_config';

// import getWeb3 from "@/lib/getWeb3";

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
      networks: {},
    };
  },

  methods: {
    setNetwork(new_network) {
      this.selectedNetwork = new_network;
    }
  },


  mounted() {
    this.endLoading();
    console.log("App.vue : mounted");
    this.networks = Object.keys(networks);
  }

}
</script>


<style>

</style>