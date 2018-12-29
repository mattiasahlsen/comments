import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import jquery from 'jquery'
window.$ = window.jquery = jquery

/* eslint-disable */
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap'
/* eslint-enable */

library.add(faThumbsUp)
library.add(faThumbsDown)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') localStorage.setItem('loggedIn', 'true')

if (localStorage.getItem('loggedIn') === 'true') {
  store.dispatch('getUser')
    .then(user => {
      store.commit('login', user)
    }).catch(err => {
      localStorage.removeItem('loggedIn')
    })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
