<template>
  <div class="container">
    <div class="row justify-content-center">
      <Search @submit="redirect"/>
    </div>

    <div v-if="addUrl && normUrl && normHostname" class="blockNote alert">
      <button type="button" class="blockNoteClose" data-dismiss="alert" aria-label="Close"
        @click.prevent="addUrl = false">
        &times;
      </button>
      <div class="blockNoteInfo">
        <h3>There is currently no discussion on the entered URL</h3>

          <button v-if="cache[normHostname]" class="inline" @click="redirect(normHostname)">
            Go to discussion on: {{normHostname}}
          </button>

          <button class="inline" @click="newCommentField(normUrl)">
            Start new discussion on: {{shortHref}}
          </button>

        <div v-if="!cache[normHostname] && normUrl !== normHostname">
          Or
          <button class="inline" @click="newCommentField(normHostname)">
            create a domain-wide
          </button> for <i>{{normHostname}}</i>?
        </div>
      </div>
    </div>

    <div v-if="comments">
      <div class="videoInterface" v-if="isYoutubeVideo()">
        <div class="videoControlPanel">
          <button class="inline iconButton" @click="videoVisibility = !videoVisibility">Toggle video</button>
          <div class="videoSizeControl inline" v-if="videoVisibility">
            Video Size:
           <select v-model="youtubeVideoWidth">
              <option value="100%">100%</option>
              <option value="90%">90%</option>
              <option value="80%" selected>80%</option>
              <option value="70%">70%</option>
              <option value="60%">60%</option>
              <option value="50%">50%</option>
           </select>
         </div>
        </div>

        <div v-if="videoVisibility">
         <div class="auto-resizable-iframe" :style="{ width: youtubeVideoWidth }">
          <div>
              <youtube :video-id="youtubeVideoId()" class="video"></youtube>
            </div>
          </div>
       </div>
      </div>
      <form id="comment-form" class="comment-form">
        <div class="comment-textarea-container">
          <textarea
            ref="textarea"
            v-model="comment"
            class="comment-textarea"
            placeholder="Say something..."
          ></textarea>
        </div>
        <button type="submit" @click.prevent="submit(comment)" :disabled="comment === ''" class="submit-button">
          Submit
        </button>
        <button class="cancel-button" @click.prevent="clearComment">Clear</button>
      </form>

      <div class="sorter">
        <select v-model="sort" @change="changeSort">
          <option selected="selected" value="Hot">Sort by: Hot</option>
          <option value="New">Sort by: New</option>
          <option value="Top">Sort by: Top</option>
        </select>
      </div>

      <CommentField class="col-12" :comments="comments" @loadChildren="loadChildren"/>
    </div>

    <div v-else-if="!loading" class="my-5">
      <WebsiteList :websites="websites" @redirect="redirect"/>
    </div>
    <router-link v-if="comments" to="/" class="iconButton">Home <font-awesome-icon icon="home"/></router-link>
    <clip-loader :loading="loading" color="#008ae6"></clip-loader>
  </div>
</template>

<script>
// @ is an alias to /src
import urlencode from 'urlencode'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import Search from '@/components/Search'
import CommentField from '@/components/CommentField'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'

import conf from '../config'
import { dateString, normalizeUrl, normHostname, isValid, shortString } from '../lib'

import { getIdFromURL } from 'vue-youtube-embed'

const URL = conf.API_URL

const loadComments = (vm, url) => {
  return new Promise((resolve, reject) => {
    if (url) {
      // console.log('Getting comments for url')
      if (vm.cache[url]) {
        vm.comments = vm.cache[url]
        resolve(vm.comments)
      } else {
        vm.getComments(url).then(comments => {
          resolve(comments)
        }).catch(err => {
          reject(err)
        })
      }
    } else {
      vm.comments = null
      resolve()
    }
  })
}
const sortHot = (c1, c2) => {
  // https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
  const hotScore = (comment) => {
    const order = Math.log10(Math.max(Math.abs(comment.score + 1), 1))
    const sign = comment.score > 0 ? 1 : -1
    // 10 hours newer = x10 score
    const score = sign * order + comment.createdAt.getTime() / 36000000
    return score
  }
  return hotScore(c2) - hotScore(c1)
}
const sortNew = (c1, c2) => c2.createdAt.getTime() - c1.createdAt.getTime()
const sortTop = (c1, c2) => c2.score - c1.score

export default {
  name: 'home',
  data() {
    return {
      comments: null,
      sort: 'Hot',
      comment: '',
      error: null,
      cache: {},
      websites: [],
      offset: 0,
      gotAll: false,
      addUrl: false,
      domainComments: null,
      loading: false,
      url: null, // the url to create
      youtubeVideoWidth: '70%',
      videoVisibility: true,
    }
  },
  computed: {
    shortHref() {
      if (!this.normUrl) return ''
      return shortString(this.normUrl, 55)
    },
    normUrl() {
      if (!this.url) return null
      return normalizeUrl(this.url)
    },
    normHostname() {
      if (!this.url) return null
      return normHostname(this.url)
    },
  },
  watch: {
    comment() {
      this.$refs.textarea.style.height = 'auto'
      if (this.comment.split('\n').length === 1) this.$refs.textarea.style.height = '1.2em'
      else this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
    }
  },
  components: {
    Search,
    CommentField,
    WebsiteList,
    ClipLoader
  },
  methods: {
    youtubeVideoId() {
      return getIdFromURL('https://' + this.$route.params.url)
    },
    isYoutubeVideo() {
      return this.$route.params.url.includes('youtube.com/watch?v=')
    },
    newCommentField(url) {
      axios.post(`${URL}/website/${urlencode(normalizeUrl(url))}`).then(resp => {
        resp.data.createdAt = new Date(resp.data.createdAt)
        resp.data.createdText = dateString(resp.data.createdAt)
        this.websites.unshift(resp.data)

        this.redirect(url)
        this.addUrl = false
      }).catch(err => {
        if (err.response && err.response.status === 401) {
          this.$store.commit('error', 'You must be logged in to add new comment fields.')
        } else this.$store.commit('axiosError', err)
      })
    },
    modify(comment) {
      comment.showFull = false
      comment.showChildren = false
      comment.loadingChildren = false
      comment.score = comment.likes - comment.dislikes
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
      return comment
    },
    redirect(url) {
      if (!url) return
      this.addUrl = false

      // console.log('Redirect called with url parameter ' + url)

      // must call getComments manually, beforeRouteEnter and
      // beforeRouteUpdate bugging
      if (!isValid(url)) {
        return this.$store.commit('error', 'Badly formated url.')
      }
      url = normalizeUrl(url)

      if (url && url !== this.$route.params.url) {
        // console.log('Redirecting to: ' + url)
        this.$router.push({ name: 'home', params: { url, } })
      }
    },
    loadChildren(comment) {
      if (!comment.gotAllChildren) {
        // console.log('loading children')
        comment.loadingChildren = true
        this.getComments(this.$route.params.url, comment.children.length, comment)
          .then(comments => this.handleComments(comments, comment))
          .catch(this.loadCommentsError)
          .finally(() => {
            // console.log('not loading children')
            comment.loadingChildren = false
          })
      }
    },
    handleComments(comments, parent) {
      if (!comments) return
      if (comments.length === 0 && this.offset === 0) {
        this.comments = []
        return
      }
      if (comments.length < conf.commentsLimit) this.gotAll = true

      comments.forEach(comment => {
        this.modify(comment)
        if (!parent) {
          comment.children.forEach(child => this.modify(child))
        }
      })

      if (parent) {
        parent.children = parent.children.concat(comments)
          .filter((el1, pos, self) => self.findIndex(el2 => el1._id === el2._id) === pos)
        if (comments.length < conf.childrenLimit) parent.gotAllChildren = true
        return comments
      }

      if (!this.comments) this.comments = comments
      else this.comments = this.comments.concat(comments)
      this.comments = this.comments
        .filter((el1, pos, self) => self.findIndex(el2 => el1._id === el2._id) === pos)
      if (this.sort === 'Hot') this.comments.sort(sortHot)

      return comments
    },
    goHome() {
      if (this.$route.params.url) this.$set(this.cache, this.$route.params.url, this.comments)
      this.comments = null
      this.$router.push('/')
    },
    loadCommentsError(err) {
      this.$store.commit('axiosError', err)
      this.goHome()
    },
    getComments(url = this.$route.params.url, offset, parent,
      sort = this.sort.toLowerCase()) {
      if (offset === undefined) {
        if (parent) offset = parent.children.length
        else if (this.comments) offset = this.comments.length
        else offset = 0
      }

      this.loading = true
      if (sort === 'hot') {
        return this.getComments(url, offset, parent, 'new').then(newComments => {
          return this.getComments(url, offset, parent, 'top').then(topComments => {
            return newComments.concat(topComments)
          })
        }).finally(() => setTimeout(() => { this.loading = false }, 1000)) // min 500ms loading for reduced lag
      }
      if (url) {
        return axios.get(URL + '/comments/' + urlencode(url) + '/' +
          (parent ? parent._id : sort) + '/' + offset).then(resp => {
          // if (resp.data.comments.length > 0) console.log(resp.data.comments[0])
          return resp.data.comments
        }).finally(() => { this.loading = false })
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
          this.comment = ''
          this.comments.unshift(this.modify(resp.data))
        }).catch(err => {
          if (err.response && err.response.status === 401) {
            return this.$store.commit('error', 'You must be logged in to comment.')
          } else this.$store.commit('axiosError', err)
        })
      } else console.log('Can\'t submit comment, comment not defined.')
    },
    changeSort() {
      if (!this.gotAll) {
        this.getComments().then(comments => {
          // console.log(comments)
          this.handleComments(comments)
        }).catch(this.loadCommentsError)
      }
      if (this.sort === 'New') this.comments.sort(sortNew)
      else if (this.sort === 'Top') this.comments.sort(sortTop)
    },
    clearComment() {
      this.comment = ''
      this.$refs.textarea.focus()
    },

    normalizeUrl,
  },
  beforeRouteEnter(to, from, next) {
    // console.log('Before route enter.')
    next(vm => {
      loadComments(vm, to.params.url)
        .then(comments => vm.handleComments(comments))
        .catch(vm.loadCommentsError)
    })
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('Before route update.')
    this.addUrl = false

    if (from.params.url) this.$set(this.cache, from.params.url, this.comments)
    loadComments(this, to.params.url)
      .then(comments => {
        this.handleComments(comments)
        next()
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          if (to.params.url) {
            this.url = normalizeUrl(to.params.url)
            const normUrl = normalizeUrl(to.params.url)
            const normHost = normHostname(to.params.url)
            if (normUrl !== normHost) {
              loadComments(this, normHost).then(comments => {
                this.$set(this.cache, normHost, comments)
              }).catch(err => this.loadCommentsError)
            }

            this.addUrl = true
          }
        } else this.$store.commit('axiosError', err)

        next(false)
      })
  },
  beforeRouteLeave(to, from, next) {
    // console.log('Before route leave.')
    if (from.params.url) this.$set(this.cache, from.params.url, this.comments)
    this.gotAll = false
    this.addUrl = false
    next()
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

    window.onscroll = ev => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight &&
        window.scrollY > 0) {
        // you're at the bottom of the page
        if (!this.gotAll && this.$route.params.url) {
          this.getComments().then(comments => this.handleComments(comments))
            .catch(this.loadCommentsError)
        }
      }
    }
  },
}
</script>
