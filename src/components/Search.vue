<template>
  <div>
    <input class="search" v-bind:placeholder="currentUrl" v-model="url" v-on:keyup.enter.prevent="redirect(url)" spellcheck="false"/>
  </div>
</template>

<script>
import { shortString, } from '../lib'
import { redirect } from '../dependent-lib'
import router from '../router'

export default {
  data() {
    return {
      url: '',
    }
  },
  computed: {
    currentUrl() {
      const page = this.$route.params.url ? shortString(this.$route.params.url, 20) : ''
      return page === '' ? 'Enter URL for comments...' : page
    }
  },
  mounted() {
    router.afterEach((to, from) => {
      this.url = ''
    })
  },
  methods: {
    redirect,
  }
}
</script>
