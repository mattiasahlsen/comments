<template>
  <div class="container">
    <div class="row justify-content-center">
      <Search class="mt-5 col-sm-6 col-11" @submit="redirect"/>
    </div>
    <div class="row">
    </div>
    <div class="row m-5" v-if="comments">
      <form id="comment-form" class="col-12 col-md-9 col-lg-6 mb-5">
        <input class="form-control mb-2" placeholder="Write a comment..."
        v-model="comment"/>
        <button type="submit" class="btn btn-primary mr-1" @click.prevent="submit(comment)">Submit</button>
        <button type="submit" class="btn btn-secondary" @click.prevent="comment = ''">Cancel</button>
      </form>

      <CommentField class="col-12" :comments="comments"></CommentField>
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

export default {
  name: 'home',
  data() {
    return {
      comments: null,
      comment: '',
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
      // must call getComments manually, beforeRouteEnter and
      // beforeRouteUpdate bugging
      if (url) {
        console.log('Redirecting to: ' + url)
        this.$router.push({ name: 'home', params: { url, } })
      }
    },
    getComments(url) {
      if (url) {
        url = urlencode(url)
        axios.get(URL + '/comments/' + url).then(resp => {
          this.comments = resp.data.comments
          console.log('Comments: ')
          console.log(this.comments)
        }).catch(err => {
          // TODO: handle error
          console.log(err)
          this.$router.push({ name: 'home', params: {} })
        })
      } else throw new Error('Cannot get comments for undefined url.')
    },
    submit(comment, parentId) {
      if (!this.$route.params.url) {
        throw new Error('Can\'t comment, params.url not defined.')
      } else if (comment) {
        const url = urlencode(this.$route.params.url)
        axios.post(`${URL}/comments/${url}/submit`, {
          comment: {
            text: comment,
            parentId
          }
        }).then(resp => {
          console.log(resp.data)
          // add my displayname to new comment
          if (resp.status === 200) this.comments.unshift(resp.data)
          else this.$store.commit('status', resp.status)
        }).catch(err => {
          this.$store.commit('error', err.message)
        })
      } else console.log('Can\'t submit comment, comment not defined.')
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('Before route enter.')
    next(vm => {
      console.log('Guard next called.')
      if (to.params.url) {
        vm.getComments(to.params.url)
      } else {
        // TODO: "Cache", i.e. save in a variable instead of just throwing away
        vm.comments = null
      }
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Before route update.')
    if (to.params.url) {
      console.log('Getting comments for url')
      this.getComments(to.params.url)
    } else {
      // TODO: "Cache", i.e. save in a variable instead of just throwing away
      this.comments = null
    }
    next()
  }
}
</script>

<style scoped lang="scss">
#comment-form {
}
</style>
