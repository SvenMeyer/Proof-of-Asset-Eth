<template>
    <b-jumbotron>
      <h1>Proof of Asset Explorer</h1>
      <p class="lead">List all assets registered by a certain address:</p>

      <small class="lead text-danger">{{errorMsg}}</small>
<!--
    <b-form class="pt-3">
      <b-form-group
        label="Asset owner:"
        description="The value should be an Zilliqa address.">
        <b-form-input
          v-model="form.owner"
          :state="validAddress"
          type="text"
          required
          placeholder="Enter your zil address">
        </b-form-input>
      </b-form-group>

      <b-button @click="deploy" type="button" variant="primary">Search</b-button>
    </b-form>
-->

    <b-input-group class="mb-3" prepend="Zil Address">
      <b-form-input
        v-model="form.owner"
        :state="validAddress"
        type="text"
        required>
      </b-form-input>
      <b-input-group-append>
        <b-button @click="deploy" type="button" variant="primary">Search</b-button>
      </b-input-group-append>
    </b-input-group>


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
import {
  BJumbotron,
  // BFormGroup,
  BFormInput,
  // BForm
} from 'bootstrap-vue'
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'


export default {
  name: 'Deploy-form',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin],
  components: {
    'b-jumbotron': BJumbotron,
    // 'b-form': BForm,
    // 'b-form-group': BFormGroup,
    'b-form-input': BFormInput
  },

  computed: {
    validAddress() {
      /*
      if (this.form.owner) {
        const valid = this.validateAddress(this.form.owner);
        console.log({valid});
      }
      */

      return this.form.owner && (this.validateAddress(this.form.owner) !== null);
    }
  },

  data() {
    return {
      form: {
        owner: null,
      },
      errorMsg: null,
      contract: {},
    };
  },

  methods: {

    async deploy() {
      console.log("this.form.owner =", this.form.owner);
      this.errorMsg = null;

      console.log(this.validateAddress(this.form.owner));

      this.startLoading('Transaction pending ...');
/*
      try {
        this.contract = await this.deployFungibleToken(
          this.form.owner,
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
      this.endLoading();
    },

    observableAccount() {
      setTimeout(() => {
        this.form.owner = window.zilPay.wallet.defaultAccount.bech32;
        window.zilPay.wallet.observableAccount().subscribe(account => {
          this.form.owner = account.bech32;
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
