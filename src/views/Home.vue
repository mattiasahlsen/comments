<template>
  <div class="container">
    <Search></Search>

    <div class="my-5">
      <WebsiteList :websites="urls" @redirect="redirect"/>
      <clip-loader class="loader" :loading="loading" color="#008ae6"></clip-loader>
    </div>
  </div>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import Search from '@/components/Search'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'
import { redirect } from '../dependent-lib'
import conf from '../config'

const URL = conf.API_URL
export default {
  name: 'home',
  data() {
    return {
      error: null,

      loading: false,
      gotAll: false,
    }
  },
  components: {
    WebsiteList,
    Search,
    ClipLoader,
  },
  computed: {
    urls() {
      return this.$store.getters.urls
    }
  },
  methods: {
    redirect,
    async tryLoadWebsites() {
      if (this.gotAll) return false
      if (!this.loading) {
        await this.loadWebsites()
        return true
      }
      return false
    },
    loadWebsites() {
      this.loading = true
      return axios.get(URL + '/websites/' + this.urls.length).then(resp => {
        this.$store.commit('addUrls', resp.data.websites)
        if (resp.data.websites.length < conf.websitesLimit) this.gotAll = true
      }).catch(err => {
        this.$store.commit('axiosError', err)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.tryLoadWebsites()
    this.$store.commit('onScroll', {
      index: 1,
      fun: () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.9 && window.scrollY > 0) {
          if (!this.gotAll) this.tryLoadWebsites()
          this.nearBottom = true
        } else {
          this.nearBottom = false
        }
      }
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
