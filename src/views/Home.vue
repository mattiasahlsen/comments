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

      <CommentField class="col-12" :comments="comments" @loadChildren="loadChildren"/>
    </div>
    <WebsiteList v-else :websites="websites" @redirect="redirect"/>
  </div>
</template>

<script>
// @ is an alias to /src
import urlencode from 'urlencode'

import Search from '@/components/Search'
import CommentField from '@/components/CommentField'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'

import conf from '../config'

const URL = process.env.VUE_APP_API_URL

const loadComments = (vm, url) => {
  if (url) {
    console.log('Getting comments for url')
    if (vm.cache[url]) vm.comments = vm.cache[url]
    else vm.getComments(url)
  } else vm.comments = null
}
const sortHot = (c1, c2) => {
  const hotScore = (comment) => {
    const order = Math.log10(Math.max(Math.abs(comment.score), 1))
    const sign = comment.score > 0 ? 1 : -1
    // 10 hours newer = x10 score
    return sign * order + comment.createdAt.getTime() / 36000000
  }
  return hotScore(c2) - hotScore(c1)
}
const dateString = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ]
  const now = new Date()

  if (date.getFullYear() === now.getFullYear()) {
    if (date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) {
        return date.toTimeString().split(' ')[0]
      }
      if (now.getDate() - date.getDate() < 7) {
        return days[date.getDay()]
      }
      return days[date.getDay()] + ' ' + date.getDate()
    } else return months[date.getMonth()] + ' ' + date.getDate()
  } else {
    return months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()
  }
}

export default {
  name: 'home',
  data() {
    return {
      comments: null,
      comment: '',
      error: null,
      cache: {},
      websites: [],
      offset: 0,
      gotAll: false
    }
  },
  props: ['url'],
  components: {
    Search,
    CommentField,
    WebsiteList
  },
  methods: {
    modify(comment) {
      comment.showFull = false
      comment.score = comment.likes - comment.dislikes
      // TODO: More sophisticated timezone handling and time displaying
      comment.createdAt = new Date(comment.createdAt)
      comment.createdText = dateString(comment.createdAt)

      if ((comment.text.match(/\n/g) || []).length >= 10) {
        let count = 0
        let i = 0
        while (count < 10) {
          if (comment.text.charAt(i) === '\n') count++
          i++
        }
        comment.someText = comment.text.slice(0, i)
      } else if (comment.text.length > 100) {
        comment.someText = comment.text.slice(0, 100)
      }

      comment.text = comment.text.replace(/\n/g, '<br>')
      if (comment.someText) comment.someText = comment.someText.replace(/\n/g, '<br>')
    },
    redirect(url) {
      // must call getComments manually, beforeRouteEnter and
      // beforeRouteUpdate bugging
      if (url) {
        console.log('Redirecting to: ' + url)
        if (url === this.$route.params.url) loadComments(this, url)
        else this.$router.push({ name: 'home', params: { url, } })
      }
    },
    loadChildren(comment) {
      if (!comment.gotAllChildren) {
        this.getComments(this.$route.params.url, comment.children.length || 0, comment)
      }
    },
    getComments(url, offset = 0, parent) {
      if (url) {
        url = urlencode(url)
        return axios.get(URL + '/comments/' + url + '/' +
          (parent ? parent._id + '/' : '') + offset).then(resp => {
          if (resp.data.comments.length < conf.commentsLimit) this.gotAll = true

          resp.data.comments.forEach(comment => {
            this.modify(comment)
            if (!parent) {
              comment.children.forEach(child => this.modify(child))
              comment.children.sort(sortHot)
            }
          })
          resp.data.comments.sort(sortHot)

          if (parent) {
            parent.children = parent.children.concat(resp.data.comments)
              .filter((el, pos, self) => self.indexOf(el) === pos)
            if (resp.data.comments.length < conf.childrenLimit) parent.gotAllChildren = true
            return
          }

          if (!this.comments) this.comments = resp.data.comments
          else this.comments = this.comments.concat(resp.data.comments)
          this.comments = this.comments
            .filter((el, pos, self) => self.indexOf(el) === pos)

          return resp.data.comments
        }).catch(err => {
          // TODO: handle error
          if (err.response && err.response.status === 404) {
            this.$store.commit('error', 'There are no comments for this url.')
          } else this.$store.commit('axiosError', err)
          this.comments = null
          this.$router.push({ name: 'home', params: {} })
          return err
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
    next(vm => loadComments(vm, to.params.url))
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Before route update.')
    if (from.params.url) this.cache[from.params.url] = this.comments
    loadComments(this, to.params.url)
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log('Before route leave.')
    if (from.params.url) this.cache[from.params.url] = this.comments
    this.gotAll = false
  },
  created() {
    axios.get(URL + '/websites').then(resp => {
      this.websites = resp.data.websites
    }).catch(err => {
      this.$store.commit('axiosError', err)
    })

    window.onscroll = ev => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight &&
        window.scrollY > 0) {
        // you're at the bottom of the page
        if (!this.gotAll && this.$route.params.url) {
          this.getComments(this.$route.params.url,
            this.comments ? this.comments.length : 0)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#comment-form {
}
</style>
