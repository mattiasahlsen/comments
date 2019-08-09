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
  let err
  switch (code) {
    case 401:
      err = 'Authentication failed'
      break
    case 404:
      err = 'Couldn\'t find resource.'
      break
    case 422:
      err = 'Invalid fields.'
      break
    case 500:
      err = 'Error on the server.'
      break
    default:
      err = 'HTTP error ' + code
  }

  if (state.errors.length === 0 || state.errors[state.errors.length - 1] !== err) state.errors.push(err)
}

export default new Vuex.Store({
  state: {
    errors: [],
    urls: [],
    onScroll: [],
  },
  getters: {
    errors: state => state.errors,
    urls: state => state.urls,
  },
  mutations: {
    error(state, err) {
      const errMsg = err.message ? err.message : err
      if (typeof errMsg !== 'string') throw new Error('Invalid argument err to error mutation of store.')

      if (state.errors.length === 0 || state.errors[state.errors.length - 1] !== errMsg) state.errors.push(errMsg) // only add it if it's not the latest error already
    },
    axiosError(state, err) {
      if (err.response) status(state, err.response.status)
      else if (err.request) state.errors.push('Couldn\'t reach server: ' + err.message)
      else state.errors.push(err.message)
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
    },
    onScroll(state, { index, fun }) {
      state.onScroll[index] = fun
      window.onscroll = () => state.onScroll.forEach(fun => fun())
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
