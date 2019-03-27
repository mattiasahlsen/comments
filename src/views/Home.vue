<template>
  <div class="container">
    <Search @submit="redirect"/>

    <div class="my-5">
      <WebsiteList :websites="websites" @redirect="redirect"/>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'

import { dateString, normalizeUrl, normHostname, isValid, shortString, modify } from '../lib'
import conf from '../config'

const URL = conf.API_URL
export default {
  name: 'home',
  data() {
    return {
      comments: null,
      error: null,
      websites: [],
    }
  },
  components: {
		WebsiteList,
		Search,
  },
  methods: {
    redirect(url) {
      if (!url) return
      this.addUrl = false

      if (!isValid(url)) {
        return this.$store.commit('error', 'Badly formated url.')
			}
      this.$router.push({ name: 'url', params: { url, } })
    },

    normalizeUrl,
  },
  created() {
    axios.get(URL + '/websites').then(resp => {
      this.websites = resp.data.websites
      this.websites.forEach(el => {
        el.createdAt = new Date(el.createdAt)
        el.createdText = dateString(el.createdAt)
      })
    }).catch(err => {
      this.$store.commit('axiosError', err)
    })

  },
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}

.inline {
  margin-right: 0.2em;
}
</style>
