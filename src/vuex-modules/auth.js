import axios from 'axios'

axios.defaults.withCredentials = true
const URL = process.env.VUE_APP_API_URL

export default {
  state: {
    user: null,
  },
  getters: {
    isAuthenticated: state => !!state.user
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
      try {
        const resp = await axios.post(URL + data.endpoint, data.user)
        commit('login', resp.data.user)
        return resp
      } catch (err) {
        const resp = err.response
        if (resp) {
          switch (resp.status) {
            case 404:
              throw new Error('User not found.')
            case 401:
              throw new Error('Invalid username or password.')
            case 500:
              throw new Error('Error on the server.')
            case 422:
              throw new Error('Invalid fields.')
            default:
              throw err
          }
        } throw err
      }
    },
    async getUser({ commit, dispatch }) {
      const resp = await axios.get(URL + '/user').catch(err => {
        if (err.response && err.response.status === 401) {
          throw new Error('You are not logged in.')
        } else throw err
      })
      return resp
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
      state.user = user
      localStorage.setItem('loggedIn', 'true')
    },
    logout(state) {
      state.user = null
      localStorage.removeItem('loggedIn')
    }
  }
}
