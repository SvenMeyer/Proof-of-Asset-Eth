<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark">

      <b-navbar-brand href="#">Zilliqa ProofIPFS Explorer</b-navbar-brand>

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
        <b-tab title="IPFS upload &amp; Registration" active class="mx-auto" style="width: 896px;">
          <ipfs-upload-register/>
        </b-tab>
        <b-tab title="Asset Explorer">
          <asset-explorer/>
        </b-tab>
      </b-tabs>

    </b-container>

    <!-- --------------------------------------------------------------------- -->

    <b-modal :ref="code.notZilPay"
             hide-footer
             title="ZilPay is not installed!">
      <b-row class="justify-content-md-center">
        <img src="/img/home.png">
      </b-row>

      <b-row class="justify-content-md-center">
        <a href="https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd"
           target="_blank"
           class="btn btn-success m-2">Chrome</a>
        <a href="https://addons.mozilla.org/en-GB/firefox/addon/zilpay/"
           target="_blank"
           class="btn btn-success m-2">Firefox</a>
      </b-row>
    </b-modal>

    <b-modal :ref="code.notEnable"
             hide-footer
             title="ZilPay is not enabled !">
      <b-row class="justify-content-md-center">
        <img src="/img/lock.png">
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import IPFSUploadRegister from './components/IPFSUploadRegister'
import AssetExplorer from './components/AssetExplorer'
import ZilPayMixin from './mixins/ZilPay'
import LoadMixin from './mixins/loader'

export default {
  name: 'app',
  mixins: [ZilPayMixin, LoadMixin],
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
    window.addEventListener("load", async () => {
      this.endLoading();
      const test = await this.zilpayTest();
      console.log("zilpayTest : ", test);

      if (test === this.code.notZilPay) {
        this.$refs[this.code.notZilPay].show();
      } else if (test === this.code.notEnable) {
        this.$refs[this.code.notEnable].show();
      } else if (test === this.code.notConnect) {
        await window.zilPay.wallet.connect();
      }
    });
  }
}
</script>


<style>

</style>