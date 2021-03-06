// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './utils/http'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import * as filters from './utils/filters'
import toFormData from './utils/toFormData.js'
import VueHtml5Editot from 'vue-html5-editor'
import options from './utils/editorConfigure.js'

Vue.use(ElementUI)
Vue.use(VueHtml5Editot, options)
Vue.prototype.axios = axios
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.toFormData = toFormData
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
