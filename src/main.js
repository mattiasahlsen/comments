import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'cookieconsent/build/cookieconsent.min.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown, faTimes, faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'modern-normalize/modern-normalize.css'
import 'cookieconsent/build/cookieconsent.min.css'

library.add(faThumbsUp, faThumbsDown, faReply, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

if (process.env.NODE_ENV === 'development') localStorage.setItem('loggedIn', 'true')

if (localStorage.getItem('loggedIn') === 'true') {
  store.dispatch('getUser')
    .then(user => {
      store.commit('login', user)
    }).catch(err => {
      localStorage.removeItem('loggedIn')
    })
}

window.cookieconsent.initialise({
  'palette': {
    'popup': {
      'background': '#222f3e'
    },
    'button': {
      'background': '#1abc9c'
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
