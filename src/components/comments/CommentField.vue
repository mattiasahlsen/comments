<template>
  <div class="comment-field">

    <div v-if="parent && comments.length > 0">
      <p v-if="!show" @click="show = true"
        class="clickable showReplies">Show replies to {{parent.displayName}}</p>
      <p v-else class="clickable hideReplies" @click="show = false">
        Hide the replies to {{parent.displayName}}
      </p>
    </div>

    <div v-show="show" class="comment-field-content" :class="{ background: show && !haveMargin }">
      <Margin v-if="haveMargin" class="margin" @collapsed="hasSpace = false"/>

      <div class="stretch">
        <div v-for="comment in comments" :key="comment._id">
          <Comment
            :comment="comment"
            :replyingTo="replyingTo === comment._id"
            @reply="replyingTo = comment._id"
            @cancelReply="replyingTo = null"
            @submitReply="reply => submitComment(reply, comment)"
          ></Comment>
          <CommentField
            :parent="comment"
            :sort="sort"
            :depth="depth + 1"
            :allowMargin="haveMargin"
          ></CommentField>
        </div>

        <div v-if="parent">
          <p v-if="!gotAll" @click="tryLoadComments" class="clickable load-more">Load more...</p>
        </div>

        <clip-loader class="loader" :loading="loading" color="#008ae6"></clip-loader>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
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
import eventBus from '../../eventBus'

const URL = conf.API_URL

const removeDuplicates = (el1, pos, self) => self.findIndex(el2 => el1._id === el2._id) === pos

const Margin = Vue.component('Margin', {
  render: create => create('div', {}),
  mounted() {
    if (this.$el.offsetWidth < 25) {
      this.$emit('collapsed')
    }
  }
})

export default {
  name: 'CommentField',
  components: {
    ClipLoader,
    Comment,
    Margin,
  },
  props: ['parent', 'sort', 'depth', 'allowMargin'],
  data() {
    return {
      show: this.depth < 2,
      gotAll: false,
      loading: false,
      nearBottom: false,
      replyingTo: null,

      newComments: [],
      topComments: [],
      myNewComments: [],

      displayComments: [], // the comments displayed to the user, updated when loading is finished

      hasSpace: true,
    }
  },
  computed: {
    haveMargin() {
      return (!this.parent || this.allowMargin) && this.hasSpace
    },
    comments() {
      if (this.loading) return this.displayComments // return last comments

      const comments = this.newComments.concat(this.topComments).concat(this.myNewComments)
        .filter(removeDuplicates) // remove duplicates
        .map(extend)
      
      if (this.sort === 'Hot') comments.sort(sortHot)
      else if (this.sort === 'New') comments.sort(sortNew)
      else if (this.sort === 'Top') comments.sort(sortTop)
      else throw new Error('Invalid value of this.sort')
      comments.sort(sortPrio)

      this.displayComments = comments
      return comments
    },
    hostname() {
      return normHostname(this.$route.params.url)
    },
  },
  watch: {
    'parent.children': function(children) {
      this.newComments = this.newComments.concat(children).filter(removeDuplicates)
    },
    replyText() {
      const textarea = this.$refs.replyTextarea[0]
      textarea.style.height = 'auto'
      if (this.replyText.split('\n').length === 1) textarea.style.height = '1.2em'
      else textarea.style.height = textarea.scrollHeight + 'px'
    },
    '$route.path': function() {
      this.newComments = []
      this.topComments = []
      this.myNewComments = []
      this.displayComments = []
      this.gotAll = false
      this.tryLoadComments()
    }
  },
  methods: {
    submitComment(comment, parent) {
      comment.prio = true // if I submit a comment, I want it to come to the top instantly
      if (!parent) this.newComments.unshift(comment)
      else parent.children.unshift(comment)
    },


    // don't stack loadComments, all tryLoadComments called while loading is true will have no effect
    async tryLoadComments() {
      if (this.gotAll) return false
      if (!this.loading) {
        await this.loadComments()
        return true
      }
      return false
    },
    loadComments(url = this.$route.params.url, sort = this.sort.toLowerCase()) { // resolves to undefined
      // 2 margin offset to not "jump over" new comments
      const offset = Math.max(0, (sort === 'new' ? this.newComments.length : this.topComments.length) - 2)
      this.loading = true
      if (sort === 'hot') {
        return this.loadComments(url, 'new').then(() => this.loadComments(url, 'top'))
      }
      else {
        let error
        let hostWebsiteExists = false

        return axios.get(`${URL}/comments/${urlencode(url)}/${sort}/${this.parent && this.parent._id}/${offset}`).then(resp => {
          if (!parent && resp.data.comments.length < conf.commentsLimit) this.gotAll = true
          else if (parent && resp.data.comments.length < conf.childrenLimit) this.gotAll = true

          if (sort === 'new') this.newComments = this.newComments.concat(resp.data.comments).filter(removeDuplicates)
          else this.topComments = this.topComments.concat(resp.data.comments).filter(removeDuplicates)

          this.$emit('loaded')
        }).catch(async err => {
          let error = err
          if (err.response && err.response.status === 404) {
            error = 404
            if (url !== this.hostname) {
              hostWebsiteExists = await axios.get(URL + '/websites/' + this.hostname).then(resp => resp && resp.status === 200)
            }
          } else this.loadCommentsError(err)
          this.$emit('loadError', error, hostWebsiteExists)
        }).finally(() => setTimeout(() => {
          this.loading = false
        }, 500)) // min 1s loading for reduced lag
      }
    },
    loadCommentsError(err) {
      this.$store.commit('axiosError', err)
    },
  },
    mounted() {
    if (!this.parent) {
      this.tryLoadComments()

      this.$store.commit('onScroll', {
        index: 0,
        fun: () => {
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.9 && window.scrollY > 0) {
            if (!this.gotAll && this.$route.params.url) {
              this.tryLoadComments()
            }
            this.nearBottom = true
          } else {
            this.nearBottom = false
          }
        }
      })
    } else {
      this.newComments = this.parent.children
      if (this.newComments.length === 0) this.tryLoadComments()
      else if (this.newComments.length < conf.childrenLimit) this.gotAll = true
    }
  },
}
</script>

<style lang="scss" scoped>
.background {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.comment-field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.comment-field-content {
  display: flex;
}
.margin {
  border-left: 2px solid rgba(150, 150, 150, 0.4);
  margin-top: 1em;
  margin-bottom: 1em;
  margin-right: 0.5em;
  flex: 0 1000 25px;
}
.stretch {
  flex: 1 1 auto;
}

.loader {
  margin: 2em 0;
}
.showReplies,
.hideReplies {
  display: block;
  box-shadow: 0 4px 5px -2px rgba(211, 211, 211, 0.5);
  border-radius: 0.5em;
  padding: 0.5em;
  &:hover {
    cursor: pointer;
    color: $dark;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
