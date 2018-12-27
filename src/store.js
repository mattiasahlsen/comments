import Vue from 'vue'
import Vuex from 'vuex'

import auth from './vuex-modules/auth'

Vue.use(Vuex)

const status = (state, code) => {
  switch (code) {
    case 401:
      state.error = 'Authentication failed'
      return
    case 404:
      state.error = 'Invalid comment section url'
      return
    case 422:
      state.error = 'Invalid fields.'
      return
    case 500:
      state.error = 'Error on the server.'
      return
    default:
      state.error = 'HTTP error ' + code
  }
}

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    error(state, msg) {
      state.error = msg
    },
    axiosError(state, err) {
      if (err.response) status(state, err.response.status)
      else if (err.request) state.error = 'Couldn\'t reach server: ' + err.message
      else state.error = err.message
    },
    clearError(state) {
      state.error = null
    },
    status(state, code) {
      status(state, code)
    }
  },
  actions: {

  },
  modules: {
    auth
  }
})
