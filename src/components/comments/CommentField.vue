<template>
  <div :class="{ 'comment-field': !parent, 'comment-replies': parent }">

    <p v-if="parent && !show" @click="show = true"
      class="clickable showReplies">Show Replies the replies to {{parent.displayName}}</p>

    <div v-if="show">
      <div v-for="comment in comments" :key="comment._id" class="mb-3">
        <Comment
          :comment="comment"
          :replyingTo="replyingTo === comment._id"
          @reply="replyingTo = comment._id"
          @cancelReply="replyingTo = null"
          @submitReply="reply => submitReply(comment, reply)"
        ></Comment>
        <CommentField v-if="comment.children.length > 0" :parent="comment" :sort="sort"></CommentField>
      </div>

      <div v-if="!parent">
        <router-link v-if="comments" to="/" class="iconButton">Home</router-link>
        <button v-if="nearBottom" v-scroll-to="'#app'" class="iconButton">Go to top</button>
      </div>
      <div v-else>
        <p v-if="!gotAll" @click="loadComments" class="clickable load-more">Load more...</p>
        <p class="clickable hideReplies" v-if="show" @click="show = false">
          Hide the replies to {{parent.displayName}}
        </p>
      </div>
    </div>

    <clip-loader :loading="loading" color="#008ae6"></clip-loader>
  </div>
</template>

<script>
import urlencode from 'urlencode'
import axios from 'axios'
import conf from '../../config'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {
  extend,
  normHostname,
  sortHot,
  sortNew,
  sortTop,
  sortPrio,
} from '../../lib'
import router from '../../router'
import Comment from './Comment'

const URL = conf.API_URL

export default {
  name: 'CommentField',
  components: {
    ClipLoader,
    Comment,
  },
  props: ['parent', 'sort'],
  data() {
    return {
      show: !this.parent,
      gotAll: false,
      loading: false,
      nearBottom: false,
      replyingTo: null,

      newComments: [],
      topComments: [],
      myNewComments: [],
    }
  },
  computed: {
    comments() {
      const comments = this.newComments.concat(this.topComments).concat(this.myNewComments)
        .filter((el1, pos, self) => self.findIndex(el2 => el1._id === el2._id) === pos) // remove duplicates
        .map(extend)

      if (this.sort === 'Hot') comments.sort(sortHot)
      else if (this.sort === 'New') comments.sort(sortNew)
      else if (this.sort === 'Top') comments.sort(sortTop)
      else throw new Error('Invalid value of this.sort')
      comments.sort(sortPrio)

      return comments
    },
    hostname() {
      return normHostname(this.$route.params.url)
    },
  },
  watch: {
    sort() {
      this.loadComments()
    },
    replyText() {
      const textarea = this.$refs.replyTextarea[0]
      textarea.style.height = 'auto'
      if (this.replyText.split('\n').length === 1) textarea.style.height = '1.2em'
      else textarea.style.height = textarea.scrollHeight + 'px'
    }
  },
  methods: {
    submitReply(parent, reply) {
      comment.prio = true
      parent.children.unshift(reply)
    },
    submitComment(comment) {
      comment.prio = true // if I submit a comment, I want it to come to the top instantly
      this.newComments.unshift(comment)
    },
    loadComments(url = this.$route.params.url, sort = this.sort.toLowerCase()) {
      // 2 margin offset to not "jump over" new comments
      const offset = Math.max(0, (sort === 'new' ? this.newComments.length : this.topComments.length) - 2)
      this.loading = true
      if (sort === 'hot') {
        return this.loadComments(url, 'new')
          .then(() => this.loadComments(url, 'top'))
      }
      else{
        let error
        let hostnameComments
        return axios.get(`${URL}/comments/${urlencode(url)}/${sort}/${this.parent && this.parent._id}/${offset}`).then(resp => {

          if (resp.data.comments.length < conf.commentsLimit) this.gotAll = true
          if (sort === 'new') this.newComments = this.newComments.concat(resp.data.comments)
          else this.topComments = this.topComments.concat(resp.data.comments)
        }).catch(err => {
          if (err.response && err.response.status === 404) {
            if (url !== this.hostname) {
              this.loadComments(this.hostname)
                .then(comments => {
                  error = 404
                  hostnameComments = comments
                })
                .catch(err => {
                  error = 404
                })
            } else error = 404
          } else error = err
        }).finally(() => setTimeout(() => {
          this.loading = false
          if (error) {
            if (error !== 404) this.loadCommentsError(error)
            this.$emit('loadError', error, hostnameComments)
          }
          else this.$emit('loaded')
        }, 500)) // min 0.5s loading for reduced lag
      }
    },
    loadCommentsError(err) {
      this.$store.commit('axiosError', err)

      this.addUrl = true
    },
  },
  mounted() {
    this.loadComments()
    router.afterEach((to, from) => {
      this.loadComments()
    })
  },
  created() {
    window.onscroll = ev => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.9 &&
        window.scrollY > 0) {
        if (!this.gotAll && this.$route.params.url) {
          this.loadComments()
        }

        this.nearBottom = true
      } else this.nearBottom = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
