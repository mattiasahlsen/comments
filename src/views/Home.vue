<template>
  <div class="container">
    <Search></Search>

    <div class="my-5">
      <WebsiteList :websites="urls" @redirect="redirect"/>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'

import {
  dateString,
  normalizeUrl,
  normHostname,
  isValid,
  shortString,
  modify,
} from '../lib'
import { redirect } from '../dependent-lib'
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
  computed: {
    urls() {
      return this.$store.getters.urls
    }
  },
  components: {
		WebsiteList,
		Search,
  },
  methods: {
    normalizeUrl,
    redirect,
  },
  created() {
    axios.get(URL + '/websites').then(resp => {
      this.$store.commit('addUrls', resp.data.websites)
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
