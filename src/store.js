import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

import auth from './vuex-modules/auth'
import { dateString } from './lib'
import conf from './config'

Vue.use(Vuex)
const URL = conf.API_URL

const modify = url => ({
  ...url,
  createdAt: new Date(url.createdAt),
  createdText: dateString(new Date(url.createdAt)),
})

const status = (state, code) => {
  switch (code) {
    case 401:
      state.error = 'Authentication failed'
      return
    case 404:
      state.error = 'Couldn\'t find resource.'
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
    errors: [],
    urls: [],
  },
  getters: {
    errors: state => state.errors,
    urls: state => {
      return state.urls
    }
  },
  mutations: {
    error(state, err) {
      if (err.message) state.errors.push(err.message)
      else if (typeof err === 'string') state.errors.push(err)
      else throw new Error('Invalid argument err to error mutation of store.')
    },
    axiosError(state, err) {
      if (err.response) status(state, err.response.status)
      else if (err.request) state.error = 'Couldn\'t reach server: ' + err.message
      else state.error = err.message
    },
    clearError(state) {
      state.errors = []
    },
    status(state, code) {
      status(state, code)
    },

    addUrls(state, urls) {
      state.urls = state.urls.concat(urls.map(url => modify(url)))
        .filter((el1, pos, self) => self.findIndex(el2 => el1._id === el2._id) === pos) // remove duplicates
    },
    newUrl(state, url) {
      state.urls.unshift(modify(url))
    }
  },
  actions: {
    vote(context, payload) {
      const {
        like,
        commentId,
        websiteId,
      } = payload
      let { likes, dislikes, hasLiked, hasDisliked } = payload

      const startpoint = commentId ? 'comment' : 'website'
      const id = commentId || websiteId
      let endpoint
      if ((like && hasLiked) || (!like && hasDisliked)) endpoint = 'undovote'
      else if (like) endpoint = 'like'
      else endpoint = 'dislike'

      if (like) {
        if (hasLiked) {
          likes--
          hasLiked = false
        } else {
          likes++
          hasLiked = true
          if (hasDisliked) {
            dislikes--
            hasDisliked = false
          }
        }
      } else {
        if (hasDisliked) {
          dislikes--
          hasDisliked = false
        } else {
          dislikes++
          hasDisliked = true
          if (hasLiked) {
            likes--
            hasLiked = false
          }
        }
      }
      return axios.post(`${URL}/${startpoint}/${id}/${endpoint}`).then(resp => {
        if (resp.status !== 200) {
          this.$store.commit('status', resp.status)
          throw new Error('Failed to vote: ' + resp.status)
        }
        return { likes, dislikes, hasLiked, hasDisliked }
      }).catch(err => {
        this.$store.commit('error', err.message)
        throw err
      })
    }
  },
  modules: {
    auth
  }
})
