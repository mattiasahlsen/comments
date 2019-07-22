<template>
	<div>
    <Search></Search>

    <div v-if="notFound" class="blockNote alert">
      <button type="button" class="blockNoteClose" data-dismiss="alert" aria-label="Close"
        @click.prevent="$router.push('/')">
        &times;
      </button>
      <div class="blockNoteInfo">
        <h3>There is currently no discussion on the entered URL</h3>

          <button v-if="hostnameComments" class="inline" @click="redirect(hostname)">
            Go to discussion on <span class="url-link">{{hostname}}</span>
          </button>

          <button class="inline" @click="newUrl($route.params.url)">
            Start new discussion on <span class="url-link">{{$route.params.url}}</span>
          </button>

        <div v-if="!hostnameComments && $route.params.url !== hostname">
          Or
          <button class="inline" @click="newUrl(hostname)">
            create a domain-wide
          </button> for <span class="url-link">{{hostname}}</span>?
        </div>
      </div>
    </div>

    <div v-if="!loadError">

      <div class="interface" v-if="isYoutubeVideo">
        <VideoInterface/>
      </div>
      <div class="interface" v-if="url && url.news">
        <NewsInterface :news="url.news"/>
      </div>

      <CommentForm @submit="comment => $refs.rootComments.submitComment(comment)"></CommentForm>
      <div>
        <select class="sorter" v-model="sort">
          <option selected="selected" value="Hot">Sort by: Hot</option>
          <option value="New">Sort by: New</option>
          <option value="Top">Sort by: Top</option>
        </select>
      </div>

      <CommentField
        ref="rootComments"
        @loaded="loaded = true"
        @loadError="handleLoadError"
        :sort="sort"
        :depth="0"
      ></CommentField>
    </div>
	</div>
</template>

<script>
import axios from 'axios'
import urlencode from 'urlencode'

import Search from '../components/Search'
import VideoInterface from '../components/comments/VideoInterface'
import NewsInterface from '../components/comments/NewsInterface'
import CommentField from '../components/comments/CommentField'
import CommentForm from '../components/comments/CommentForm'
import {
	normalizeUrl,
	modify,
	normHostname,
  dateString,
} from '../lib'
import { guard, redirect, newUrl } from '../dependent-lib'
import conf from '../config'

const URL = conf.API_URL
const NEWS_API_KEY = process.env.VUE_APP_NEWS_API_KEY
if (!NEWS_API_KEY) throw new Error('NEWS_API_KEY not defined in env.')
const getNewsSources = axios.get(URL + '/news/sources').then(resp => resp.data)
const getNewsHeadlines = axios.get(URL + '/news/headlines').then(resp => resp.data)


export default {
	components: {
    VideoInterface,
    NewsInterface,
		CommentField,
    CommentForm,
    Search,
	},
	data() {
		return {
      comment: '',
			loaded: false,
      sort: 'Hot',

      hostnameComments: null,

			notFound: false,
      loadError: false,

      newsSources: null,
      newsSourceHosts: null,

      url: null,
		}
  },
	computed: {
    normUrl() {
      return normalizeUrl(this.$route.params.url)
    },
    hostname() {
      return normHostname(this.$route.params.url)
    },
    isYoutubeVideo() {
      return this.$route.params.url.includes('youtube.com/watch?v=')
    },
  },
  watch: {
    normUrl(url) {
      this.getUrlObject(url)
    }
  },
	methods: {
    handleLoadError(err, hostnameComments) {
      this.loadError = true
      if (err === 404) this.notFound = true
      this.hostnameComments = hostnameComments
    },
    newUrl(url) {
      newUrl(url).then(() => {
        this.clearErrors()
      }).catch(() => {})
    },
    clearErrors() {
      this.notFound = false
      this.loadError = false
    },
    getUrlObject(url = this.normUrl) {
      axios.get(URL + '/website/' + urlencode(url)).then(resp => {
        this.url = resp.data
      }).catch(err => {
        this.$store.commit('axiosError', err)
      })
    }
  },
  mounted() {
    /*getNewsHeadlines.then(headlines => {
      console.log(headlines)
    })
    getNewsSources.then(sources => {
      this.newsSources = sources
      this.newsSourceHosts = sources.map(source => normHostname(source.url))
    }).catch(err => {
      this.$store.commit('axiosError', err)
    })*/
    this.getUrlObject()
  },
	beforeRouteEnter: guard,
	beforeRouteUpdate(to, from, next) {
    this.clearErrors()
    guard(to, from, next)
  }
}
</script>

<style scoped lang="scss">
.url-link {
  color: $light-2;
}
.interface {
  width: 100%;
  background: $beige;
  margin-bottom: 3em;
}
.sorter {
  margin-bottom: 1em;
}

.blockNote {
  background: $light-background;
  margin-bottom: 1em;
  padding: 0.2em;
  line-height: 1.5em;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.blockNoteClose {
  font-size: 3em;
  min-height: 100%;
  background: $dark;
  color: $white;
  margin-right: 0.2em;
  padding: 0.2em;
}

.blockNoteInfo {
  padding: 0.5em 0;
  button {
    padding: 0.5em;
  }
}
</style>
