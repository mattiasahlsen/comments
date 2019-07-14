<template>
  <div>
    <div class="comment flex">

      <div class="flex-start">
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
      </div>

      <div class="flex-end">
        <div class="info">
          <div class="commenter">{{comment.displayName}}</div>
          <div class="comment-date">{{comment.createdText}}</div>
          <Rating
            :likes="likes" :dislikes="dislikes" :hasLiked="hasLiked" :hasDisliked="hasDisliked"
            @like="vote(true)" @dislike="vote(false)"
          />
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
import Rating from '../Rating'

import conf from '../../config'
import {
	extend,
} from '../../lib'


export default {
  components: {
    CommentForm,
    Rating,
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
      this.$store.dispatch('vote', {
        commentId: this.comment._id,
        like,
        likes, dislikes, hasLiked, hasDisliked
      }).then(data => Object.assign(this, data)).catch(err => reset())
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
}
.comment-date {
  font-size: 0.8em;
}

.comment-reply {
  padding: 0.2em;
  font-size: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

.comment-score {
  margin-right: 1em;
  font-size: 3em;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.comment-body {
  width: 65%;
  margin-right: 2%;
  border-bottom: 1px solid $light-background;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.commenter {
  font-size: 1.1em;
  font-weight: 300;
  text-align: center;
}
</style>
