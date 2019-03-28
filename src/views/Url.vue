<template>
	<div>
    <div v-if="notFound" class="blockNote alert">
      <button type="button" class="blockNoteClose" data-dismiss="alert" aria-label="Close"
        @click.prevent="notFound = false">
        &times;
      </button>
      <div class="blockNoteInfo">
        <h3>There is currently no discussion on the entered URL</h3>

          <button v-if="hostnameComments" class="inline" @click="redirect(hostname)">
            Go to discussion on: {{hostname}}
          </button>

          <button class="inline" @click="newCommentField($route.params.url)">
            Start new discussion on: {{shortHref}}
          </button>

        <div v-if="!hostnameComments && $route.params.url !== hostname">
          Or
          <button class="inline" @click="newCommentField(hostname)">
            create a domain-wide
          </button> for <i>{{hostname}}</i>?
        </div>
      </div>
    </div>

    <div class="videoInterface" v-if="isYoutubeVideo()">
      <VideoInterface></VideoInterface>
    </div>

    <CommentForm @submit="comment => $refs.rootComments.submitComment(comment)"></CommentForm>
    <div class="sorter">
      <select v-model="sort">
        <option selected="selected" value="Hot">Sort by: Hot</option>
        <option value="New">Sort by: New</option>
        <option value="Top">Sort by: Top</option>
      </select>
    </div>

		<CommentField @loaded="loaded = true" @404="handle404" :sort="sort" ref="rootComments"></CommentField>
	</div>
</template>

<script>
import VideoInterface from '../components/comments/VideoInterface'
import CommentField from '../components/comments/CommentField'
import CommentForm from '../components/comments/CommentForm'
import {
	normalizeUrl,
	loadComments,
	modify,
	normHostname,
	guard,
} from '../lib'
import conf from '../config'

const URL = conf.API_URL


export default {
	components: {
		VideoInterface,
		CommentField,
		CommentForm,
	},
	data() {
		return {
			comments: null,
      comment: '',
			notFound: false,
			loaded: false,
      sort: 'Hot',
		}
	},
	computed: {
    shortHref() {
      if (!this.normUrl) return ''
      return shortString(this.normUrl, 55)
    },
    hostname() {
      return normHostname(this.$route.path.url)
    },
	},
	methods: {
    handle404(hostnameComments) {
      this.notFound = true
      this.hostnameComments = hostnameComments
    },
    isYoutubeVideo() {
      return this.loaded && this.$route.params.url.includes('youtube.com/watch?v=')
    },
    newCommentField(url) {
      axios.post(`${URL}/website/${urlencode(normalizeUrl(url))}`).then(resp => {
        resp.data.createdAt = new Date(resp.data.createdAt)
        resp.data.createdText = dateString(resp.data.createdAt)
        this.websites.unshift(resp.data)

        this.redirect(url)
        this.notFound = false
      }).catch(err => {
        if (err.response && err.response.status === 401) {
          this.$store.commit('error', 'You must be logged in to add new comment fields.')
        } else this.$store.commit('axiosError', err)
      })
    },
	},
	beforeRouteEnter: guard,
	beforeRouteUpdate: guard,
}
</script>

<style>

</style>
