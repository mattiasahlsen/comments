<template>
  <div class="container">
    <div class="row justify-content-center">
      <Search class="mt-5 col-sm-6 col-11" @submit="redirect"/>
    </div>
    <div class="row">
      <div v-if="error" class="alert alert-danger" role="alert">
        There was a problem: {{error.message}}
      </div>
    </div>
    <div class="row m-5">
      <CommentField v-if="comments" :comments="comments"></CommentField>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import urlencode from 'urlencode'

import Search from '@/components/Search'
import CommentField from '@/components/CommentField'
import axios from 'axios'

const URL = process.env.VUE_APP_API_URL

function guard(to, from, next) {
  next(vm => {
    if (to.params.url) {
      vm.getComments(to.params.url)
    }
  })
}

export default {
  name: 'home',
  data() {
    return {
      comments: null,
      error: null,
    }
  },
  props: ['url'],
  components: {
    Search,
    CommentField,
  },
  methods: {
    redirect(url) {
      this.$router.push({ name: 'home', params: { url, } })
    },
    getComments(url) {
      if (url) {
        url = urlencode(url)
        return axios.get(URL + '/comments/' + url).then(resp => {
          this.comments = resp.data.comments
          console.log('Comments: ')
          console.log(this.comments)
        }).catch(err => {
          // TODO: handle error
          console.log(err)
          this.$router.push({ name: 'home', params: {} })
        })
      } else throw new Error('Cannot get comments for undefined url.')
    }
  },
  beforeRouteEnter: guard,
  beforeRouteUpdate: guard
}
</script>

<style scoped>
</style>
