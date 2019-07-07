// Lib depending on store and router

import urlencode from 'urlencode'
import axios from 'axios'

import store from './store'
import router from './router'
import {
  normalizeUrl,
  isValid
} from './lib'
import conf from './config'

const URL = conf.API_URL

export function redirect(url) {
  if (url) router.push({ name: 'url', params: { url, } })
}

export const guard = (to, from, next) => {
  if (isValid(to.params.url)) {
    const normalized = normalizeUrl(to.params.url)
    if (normalized === to.params.url) next()
    else next({ path: normalized, replace: true })
  } else {
    next('/')
    store.commit('error', 'Badly formated url.')
  }
}

export function newUrl(url) {
  return axios.post(`${URL}/website/${urlencode(normalizeUrl(url))}`).then(resp => {
    store.commit('newUrl', resp.data)
  }).catch(err => {
    if (err.response && err.response.status === 401) {
      store.commit('error', 'You must be logged in to add new comment fields.')
    } else if (err.response && err.response.status === 409) {
      store.commit('error', 'Url already exists.')
    } else store.commit('axiosError', err)
    throw err
  })
}
