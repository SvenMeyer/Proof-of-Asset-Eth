<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text=selectedLanguage right>
            <b-dropdown-item
              v-for="language in languages"
              :key="language"
              :active="language === selectedLanguage"
              href="#"
              @click="selectLanguage(language)"
            >{{ language }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div>
      {{selectedLanguage}}
    </div>

    <b-container class="mt-5">

      <b-row>
        <b-col>
          <deploy-form/>
        </b-col>
        <b-col>
          <connect-form/>
        </b-col>
      </b-row>
    </b-container>

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
             title="ZilPay is not Enable!">
      <b-row class="justify-content-md-center">
        <img src="/img/lock.png">
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import DeployForm from './components/Deploy-form'
import ConnectForm from './components/Connect-form'
import ZilPayMixin from './mixins/ZilPay'
import LoadMixin from './mixins/loader'


export default {
  name: 'app',
  mixins: [ZilPayMixin, LoadMixin],
  components: {
    'deploy-form': DeployForm,
    'connect-form': ConnectForm
  },

  data() {
    return {
      selectedLanguage: "EN",
      languages: ["EN", "DE", "ES", "RU"]
    };
  },

  methods: {
    selectLanguage(language) {
      this.selectedLanguage = language;
    }
  },


  mounted() {
    window.addEventListener("load", async () => {
      this.endLoading();
      const test = await this.zilpayTest();

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
