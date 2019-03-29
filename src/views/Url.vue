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

      <div class="videoInterface" v-if="loaded && isYoutubeVideo()">
        <VideoInterface></VideoInterface>
      </div>

      <CommentForm @submit="comment => $refs.rootComments.submitComment(comment)"></CommentForm>
      <div>
        <select class="sorter" v-model="sort">
          <option selected="selected" value="Hot">Sort by: Hot</option>
          <option value="New">Sort by: New</option>
          <option value="Top">Sort by: Top</option>
        </select>
      </div>

      <CommentField @loaded="loaded = true" @loadError="handleLoadError" :sort="sort" ref="rootComments"></CommentField>
    </div>
	</div>
</template>

<script>
import axios from 'axios'
import urlencode from 'urlencode'

import Search from '../components/Search'
import VideoInterface from '../components/comments/VideoInterface'
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


export default {
	components: {
		VideoInterface,
		CommentField,
    CommentForm,
    Search,
	},
	data() {
		return {
			comments: null,
      comment: '',
			loaded: false,
      sort: 'Hot',

      hostnameComments: null,

			notFound: false,
      loadError: false,
		}
  },
	computed: {
    shortHref() {
      if (!this.normUrl) return ''
      return shortString(this.normUrl, 55)
    },
    hostname() {
      return normHostname(this.$route.params.url)
    },
	},
	methods: {
    handleLoadError(err, hostnameComments) {
      this.loadError = true
      if (err === 404) this.notFound = true
      this.hostnameComments = hostnameComments
    },
    isYoutubeVideo() {
      return this.$route.params.url.includes('youtube.com/watch?v=')
    },
    newUrl(url) {
      newUrl(url).then(() => {
        this.clearErrors()
      }).catch(() => {})
    },
    clearErrors() {
      this.notFound = false
      this.loadError = false
    }
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
</style>
