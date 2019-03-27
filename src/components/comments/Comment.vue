<template>
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
			<div class="comment-date">{{comment.createdAt.toDateString() + comment.createdAt.toLocaleTimeString()}}</div>
			<div class="comment-rating">
				<span class="vote-box">
					<font-awesome-icon icon="thumbs-up" class="vote"
					:class="{ isVoted: comment.hasLiked }" @click="vote(comment, true)" />
					<span class="mr-3">{{comment.likes}}</span>
				</span>
				<span class="vote-box">
						<font-awesome-icon icon="thumbs-down" class="vote"
					:class="{ isVoted: comment.hasDisliked }" @click="vote(comment, false)" />
					<span class="mr-3">{{comment.dislikes}}</span>
				</span>
			</div>
		</div>

		<div
			class="comment-reply"
			:class="{ replyHover }"
			@mouseover="replyHover = true"
			@mouseleave="replyHover = false"
			@click="reply(comment)"
		>
			<font-awesome-icon icon="reply" class="reply" />
				<p class="reply-text">Reply</p>
		</div>

    <CommentForm v-if="replyingTo" @submit="submit" :parent="comment"></CommentForm>

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
		}
	},
  props: ['comment', 'replyingTo'],
	methods: {
    vote(comment, like) {
      const likes = comment.likes
      const dislikes = comment.dislikes
      const hasLiked = comment.hasLiked
      const reset = comment => {
        comment.likes = likes
        comment.dislikes = dislikes
        comment.hasLiked = hasLiked
        comment.score = likes - dislikes
      }
      let endpoint

      if ((like && comment.hasLiked) || (!like && comment.hasDisliked)) endpoint = 'undovote'
      else if (like) endpoint = 'like'
      else endpoint = 'dislike'

      if (like) {
        if (comment.hasLiked) {
          comment.likes--
          comment.hasLiked = false
        } else {
          comment.likes++
          comment.hasLiked = true
          if (comment.hasDisliked) {
            comment.dislikes--
            comment.hasDisliked = false
          }
        }
      } else {
        if (comment.hasDisliked) {
          comment.dislikes--
          comment.hasDisliked = false
        } else {
          comment.dislikes++
          comment.hasDisliked = true
          if (comment.hasLiked) {
            comment.likes--
            comment.hasLiked = false
          }
        }
      }
      comment.score = comment.likes - comment.dislikes

      axios.post(URL + '/comment/' + comment._id + '/' + endpoint).then(resp => {
        if (resp.status !== 200) {
          reset(comment)
          this.$store.commit('status', resp.status)
        }
      }).catch(err => {
        reset(comment)
        this.$store.commit('error', err.message)
      })
    },
    reply(comment) {
			this.$emit('reply')
    },
    sendReply(comment, text) {
      this.$emit('reply', comment._id, text)
    }
	}
}
</script>

<style scoped lang="scss">
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
