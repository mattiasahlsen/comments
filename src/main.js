import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

if (process.env.NODE_ENV === 'production' && !process.env.VUE_APP_DEBUG) {
  console.log = () => {}
}

library.add(faThumbsUp)
library.add(faThumbsDown)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
