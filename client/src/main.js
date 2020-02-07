import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'

// import TreeView from "vue-json-tree-view"
import { LayoutPlugin } from 'bootstrap-vue'
import { VBModal, ModalPlugin, BButton } from 'bootstrap-vue'
import { FormFilePlugin } from 'bootstrap-vue'
import { LinkPlugin } from 'bootstrap-vue'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.use(LayoutPlugin)
Vue.use(ModalPlugin)
// Vue.use(TreeView)
Vue.component('b-button', BButton)
Vue.directive('b-modal', VBModal)
Vue.use(FormFilePlugin)
Vue.use(LinkPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
