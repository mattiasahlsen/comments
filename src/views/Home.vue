<template>
  <div class="container">
    <div class="row justify-content-center">
      <Search @submit="redirect"/>
    </div>

    <div v-if="addUrl && parsedUrl">

      <div class="blockNote alert">
        <button type="button" class="blockNoteClose" data-dismiss="alert" aria-label="Close"
          @click.prevent="addUrl = false">
          &times;
        </button>
				<div class="blockNoteInfo">
					<h2>There is currently no comment thread for the entered URL</h2>

					<div v-if="cache[parsedUrl.origin]">
						There is a comment field
						<i>{{parsedUrl.origin}}</i>, do you want to
						<button class="inline" @click="redirect(parsedUrl.origin)">go there?</button>
					</div>

					<div>
						Do you want to
						<button class="inline" @click="newCommentField(parsedUrl.href)">
							create a new comment thread
						</button> for <i>{{parsedUrl.href}}</i>?
					</div>

					<div v-if="!cache[parsedUrl.origin] && parsedUrl.origin !== parsedUrl.href">
						Or
						<button class="inline" @click="newCommentField(parsedUrl.origin)">
							create a domain-wide
						</button> for <i>{{parsedUrl.origin}}</i>?
					</div>
					<div class="small" v-else><i>All URLs are normalized to http</i></div>
				</div>
		  </div>

    </div>

    <div v-if="comments">
      <div class="row">
        <form id="comment-form" class="comment-form">
          <input class="form-control" placeholder="Write a comment..."
            v-model="comment" type="text" />
          <button type="submit" class="" @click.prevent="submit(comment)" :disabled="comment===''">Submit</button>
          <!-- <button type="submit" class="" @click.prevent="comment = ''">Cancel</button> -->
        </form>
      </div>

      <div class="sorter">
				Sort comments by:
        <select v-model="sort" @change="changeSort" class="">
          <option selected="selected">Hot</option>
          <option>New</option>
          <option>Top</option>
        </select>
      </div>

      <div class="row">
        <CommentField class="col-12" :comments="comments" @loadChildren="loadChildren"/>
      </div>
    </div>

    <div v-else-if="!loading" class="my-5">

			<!-- <div class="mb-3">
        <h2>Comment fields for any URL.</h2>
        <p>Just type in a URL above to go to a comment field or create a new one</p>
      </div> -->

      <WebsiteList :websites="websites" @redirect="redirect"/>
    </div>

    <clip-loader class="my-3 loader" :loading="loading" color="#008ae6"></clip-loader>
  </div>
</template>

<script>
// @ is an alias to /src
import urlencode from 'urlencode'
import parseUrl from 'url-parse'
import validUrl from 'valid-url'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import Search from '@/components/Search'
import CommentField from '@/components/CommentField'
import WebsiteList from '@/components/WebsiteList'
import axios from 'axios'

import conf from '../config'

const URL = conf.API_URL

const isValid = url => validUrl.isWebUri(url) || validUrl.isWebUri('http://' + url)
const clean = url => {
  url = url.replace(/\/$/, '').replace('https', 'http')
  if (!url.includes('http')) url = 'http://' + url
  return url
}

const loadComments = (vm, url) => {
  return new Promise((resolve, reject) => {
    if (url) {
      console.log('Getting comments for url')
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
        const parts = date.toTimeString().split(':')
        return parts[0] + ':' + parts[1]
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
      sort: 'Hot',
      comment: '',
      error: null,
      cache: {},
      websites: [],
      offset: 0,
      gotAll: false,
      addUrl: false,
      parsedUrl: null,
      domainComments: null,
      loading: false
    }
  },
  components: {
    Search,
    CommentField,
    WebsiteList,
    ClipLoader
	},
  methods: {
    newCommentField(url) {
      axios.post(`${URL}/website/${urlencode(clean(url))}`).then(resp => {
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

      console.log('Redirect called with url parameter ' + url)

      // must call getComments manually, beforeRouteEnter and
      // beforeRouteUpdate bugging
      if (!isValid(url)) {
        return this.$store.commit('error', 'Badly formated url.')
      }
      url = clean(url)

      if (url && url !== this.$route.params.url) {
        console.log('Redirecting to: ' + url)
        this.$router.push({ name: 'home', params: { url, } })
      }
    },
    loadChildren(comment) {
      if (!comment.gotAllChildren) {
        this.getComments(this.$route.params.url, comment.children.length, comment)
          .then(comments => this.handleComments(comments, comment))
          .catch(this.loadCommentsError)
      }
    },
    handleComments(comments, parent) {
      if (!comments) return
      if (comments.length === 0) {
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
        }).finally(() => { this.loading = false })
      }
      if (url) {
        url = urlencode(url)
        return axios.get(URL + '/comments/' + url + '/' +
          (parent ? parent._id : sort) + '/' + offset).then(resp => {
          if (resp.data.comments.length > 0) console.log(resp.data.comments[0])

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
      this.getComments().then(comments => {
        this.handleComments(comments)
        if (this.sort === 'New') this.comments.sort(sortNew)
        else if (this.sort === 'Top') this.comments.sort(sortTop)
      }).catch(this.loadCommentsError)
    },
    clean
  },
  beforeRouteEnter(to, from, next) {
    console.log('Before route enter.')
    next(vm => loadComments(vm, to.params.url)
      .then(comments => vm.handleComments(comments))
      .catch(vm.loadCommentsError))
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Before route update.')
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
            this.parsedUrl = parseUrl(to.params.url)
            if (to.params.url !== this.parsedUrl.origin) {
              loadComments(this, this.parsedUrl.origin).then(comments => {
                this.parsedUrl = this.parsedUrl
                this.$set(this.cache, this.parsedUrl.origin, comments)
              }).catch(err => this.loadCommentsError)
            }

            this.addUrl = true
          }
        } else this.$store.commit('axiosError', err)

        next(false)
      })
  },
  beforeRouteLeave(to, from, next) {
    console.log('Before route leave.')
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
  }
}
</script>

