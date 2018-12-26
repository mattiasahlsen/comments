import Vue from 'vue'
import Vuex from 'vuex'

import auth from './vuex-modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    error(state, msg) {
      state.error = msg
    },
    clearError(state) {
      state.error = null
    },
    status(state, code) {
      switch (code) {
        case 401:
          this.error = 'Authentication failed'
          return
        case 404:
          this.error = 'Invalid comment section url'
          return
        case 422:
          this.error = 'Invalid fields.'
          return
        case 500:
          this.error = 'Error on the server.'
          return
        default:
          this.error = 'HTTP error ' + code
      }
    }
  },
  actions: {

  },
  modules: {
    auth
  }
})
