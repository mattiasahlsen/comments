import axios from 'axios'

axios.defaults.withCredentials = true
const URL = process.env.VUE_APP_API_URL

export default {
  state: {
    user: null,
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user
  },
  actions: {
    async register({ dispatch, commit }, user) {
      const data = {
        user,
        endpoint: '/register',
      }
      return dispatch('authRequest', data)
    },
    async login({ dispatch, commit }, user) {
      const data = {
        user,
        endpoint: '/login',
      }
      return dispatch('authRequest', data)
    },
    async authRequest({ commit, dispatch }, data) {
      const resp = await axios.post(URL + data.endpoint, data.user)
      commit('login', resp.data.user)
      return resp
    },
    async getUser({ commit, dispatch }) {
      try {
        return (await axios.get(URL + '/user')).data
      } catch (err) {
        if (err.response && err.response.status === 401) {
          throw new Error('You are not logged in.')
        } else throw new Error(err)
      }
    },
    async logout({ commit, dispatch }) {
      return axios.post(URL + '/logout').then(resp => {
        commit('logout')
        return resp
      })
    },
  },
  mutations: {
    login(state, user) {
      console.log('Logging in')
      console.log(user)
      state.user = user
      localStorage.setItem('loggedIn', 'true')
    },
    logout(state) {
      state.user = null
      localStorage.removeItem('loggedIn')
    }
  }
}
