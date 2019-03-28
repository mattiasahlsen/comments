<template>
  <form class="comment-form">
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
    <button class="cancel-button" @click.prevent="clearComment">{{parent ? 'Cancel' : 'Clear'}}</button>
  </form>
</template>

<script>
import urlencode from 'urlencode'
import axios from 'axios'

import conf from '../../config'
import {
} from '../../lib'

const URL = conf.API_URL

export default {
	props: ['parent'],
	data() {
		return {
      comment: '',
		}
	},
  watch: {
    comment() {
      this.$refs.textarea.style.height = 'auto'
      if (this.comment.split('\n').length === 1) this.$refs.textarea.style.height = '1.2em'
      else this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
    }
  },
	methods: {
    submit(comment) {
      if (comment) {
        const url = urlencode(this.$route.params.url)
        axios.post(`${URL}/comments/${url}/submit`, {
          comment: {
            text: comment,
            parentId: (this.parent && this.parent._id) || undefined
          }
        }).then(resp => {
					this.comment = ''
					this.$emit('submit', resp.data)
        }).catch(err => {
          console.log(err)
          if (err.response && err.response.status === 401) {
            return this.$store.commit('error', 'You must be logged in to comment.')
          } else this.$store.commit('axiosError', err)
        })
      }
		},
    clearComment() {
      if (this.parent) this.$emit('cancelReply')
      else {
        this.comment = ''
        this.$refs.textarea.focus()
      }
		},
	}
}
</script>

<style scoped>
.comment-form {
  display: 
}
</style>
