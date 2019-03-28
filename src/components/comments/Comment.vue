<template>
  <div>
    <div class="comment">

      <div class="comment-score">
        {{comment.likes - comment.dislikes}}
      </div>

      <div class="comment-body">
        <div v-if="comment.someText" class="comment-text">
          <div v-if="!showFull">
            <div v-html="comment.someText" class="comment-text"></div>
            <div @click="showFull = true"><div class="clickable my-2">Show more</div></div>
          </div>
          <div v-else>
            <div v-html="comment.text" class="comment-text"></div>
            <div @click="showFull = false"><div class="clickable my-2">Show less</div></div>
          </div>
        </div>
        <div v-else v-html="comment.text" class="comment-text"></div>
      </div>

      <div class="comment-info">
        <div class="commenter">{{comment.displayName}}</div>
        <div class="comment-date">{{comment.createdText}}</div>
        <div class="comment-rating">
          <span class="vote-box">
            <font-awesome-icon icon="thumbs-up" class="vote"
            :class="{ isVoted: hasLiked }" @click="vote(true)" />
            <span class="mr-3">{{likes}}</span>
          </span>
          <span class="vote-box">
              <font-awesome-icon icon="thumbs-down" class="vote"
            :class="{ isVoted: hasDisliked }" @click="vote(false)" />
            <span class="mr-3">{{dislikes}}</span>
          </span>
        </div>
      </div>

      <div
        class="comment-reply"
        :class="{ replyHover }"
        @mouseover="replyHover = true"
        @mouseleave="replyHover = false"
        @click="$emit('reply')"
      >
        <font-awesome-icon icon="reply" class="reply" />
          <p class="reply-text">Reply</p>
      </div>

    </div>

    <CommentForm
      v-if="replyingTo"
      @submit="reply => $emit('submitReply', reply)"
      @cancelReply="$emit('cancelReply')"
      :parent="comment">
    </CommentForm>
  </div>
</template>

<script>
import axios from 'axios'

import CommentForm from './CommentForm'
import conf from '../../config'
import {
	extend,
} from '../../lib'

const URL = conf.API_URL

export default {
  components: {
    CommentForm,
	},
	data() {
		return {
      replyHover: false,
      showFull: false,

      score: this.comment.score,
      likes: this.comment.likes,
      dislikes: this.comment.dislikes,
      hasLiked: this.comment.hasLiked,
      hasDisliked: this.comment.hasDisliked,
		}
	},
  props: ['comment', 'replyingTo'],
	methods: {
    vote(like) {
      const likes = this.likes
      const dislikes = this.dislikes
      const hasLiked = this.hasLiked
      const hasDisliked = this.hasDisliked
      const reset = () => {
        this.likes = likes
        this.dislikes = dislikes
        this.hasLiked = hasLiked
        this.hasDisliked = hasDisliked
      }
      let endpoint

      if ((like && this.hasLiked) || (!like && this.hasDisliked)) endpoint = 'undovote'
      else if (like) endpoint = 'like'
      else endpoint = 'dislike'

      if (like) {
        if (this.hasLiked) {
          this.likes--
          this.hasLiked = false
        } else {
          this.likes++
          this.hasLiked = true
          if (this.hasDisliked) {
            this.dislikes--
            this.hasDisliked = false
          }
        }
      } else {
        if (this.hasDisliked) {
          this.dislikes--
          this.hasDisliked = false
        } else {
          this.dislikes++
          this.hasDisliked = true
          if (this.hasLiked) {
            this.likes--
            this.hasLiked = false
          }
        }
      }
      this.score = this.likes - this.dislikes

      axios.post(URL + '/comment/' + this.comment._id + '/' + endpoint).then(resp => {
        if (resp.status !== 200) {
          reset()
          this.$store.commit('status', resp.status)
        }
      }).catch(err => {
        reset()
        this.$store.commit('error', err.message)
      })
    },
	}
}
</script>

<style scoped lang="scss">
.comment {
  margin-bottom: 1em;
  background: $beige;
  box-shadow: 0 4px 5px -2px rgba(211, 211, 211, 0.5);
  border-radius: 1.5em;
  padding: 1em;
  display: flex;
  flex-direction: row;
}

.replyHover {
  cursor: pointer;
  path {
    color: $secondary;
  }
}
.reply-text {
  font-size: 0.4em;
  text-align: center;
}
.isVoted path{
  color: $secondary;
}
</style>
