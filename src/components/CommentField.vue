<template>
  <div class="comment-field">
    <div v-for="comment in comments" :key="comment._id" class="mb-3">
      <div class="comment">
        <div class="comment-score">
          {{comment.likes - comment.dislikes}}
        </div>

        <div class="comment-body">
          <div v-if="comment.someText" class="comment-text">
            <div v-if="!comment.showFull">
              <div v-html="comment.someText" class="comment-text"></div>
              <div @click="comment.showFull = true"><div class="clickable my-2">Show more</div></div>
            </div>
            <div v-else>
              <div v-html="comment.text" class="comment-text"></div>
              <div @click="comment.showFull = false"><div class="clickable my-2">Show less</div></div>
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
          :class="{ replyHover: replyHover[comment._id] }"
          @mouseover="hoverReply(comment)"
          @mouseleave="unhoverReply(comment)"
          @click="replyTo(comment)"
        >
            <font-awesome-icon icon="reply" class="reply" />
            <p class="reply-text">Reply</p>
        </div>
      </div>

      <form v-if="replyingTo === comment._id" id="comment-form" class="comment-form">
        <div class="comment-textarea-container">
          <textarea v-focus class="comment-textarea" placeholder="Reply..."
            v-model="replyText" type="text" ref="replyTextarea"
          ></textarea>
        </div>
        <button @click.prevent="replyTo(comment)" class="submit-button"
         :disabled="replyText === ''">Reply</button>
        <button class="cancel-button" @click.prevent="replyingTo = null">Cancel</button>
      </form>

      <div class="comment-replies">
        <div v-if="comment.children.length > 0" class="ml-3 mt-3">
          <div v-if="!comment.showChildren" @click="comment.showChildren = true">
            <div class="clickable showReplies">Show Replies the replies to {{comment.displayName}}</div>
          </div>
          <div v-if="comment.showChildren">
            <CommentField :comments="comment.children"/>
            <div v-if="comment.children.length > 0 &&
              comment.children.length % 10 === 0" @click="$emit('loadChildren', comment)"
              class="clickable load-more">Load more...</div>

              <clip-loader
                :loading="comment.loadingChildren"
                color="#008ae6"
                size="25px"
              >
              </clip-loader>
          </div>
          <div v-if="comment.showChildren" @click="comment.showChildren = false">
            <div class="clickable hideReplies">Hide the replies to {{comment.displayName}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

const URL = conf.API_URL

export default {
  name: 'CommentField',
  props: ['comments'],
  components: {
    ClipLoader
  },
  watch: {
    comments() {
      this.comments.forEach(c => {
        if (this.replyHover[c._id] === undefined) {
          this.$set(this.replyHover, c._id, false)
        }
      })
    },
    replyText() {
      const textarea = this.$refs.replyTextarea[0]
      textarea.style.height = 'auto'
      if (this.replyText.split('\n').length === 1) textarea.style.height = '1.2em'
      else textarea.style.height = textarea.scrollHeight + 'px'
    }
  },
  data() {
    return {
      showChildren: false,
      replyHover: {},
      replyingTo: null,
      replyText: '',
    }
  },
  methods: {
    showFull(comment) {
      comment.showFull = true
    },
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
    hoverReply(comment) {
      this.replyHover[comment._id] = true
    },
    unhoverReply(comment) {
      this.replyHover[comment._id] = false
    },
    replyTo(comment) {
      this.replyingTo = comment._id
    },
    sendReply(comment, text) {
      this.$emit('reply', comment._id, text)
    }
  },
  mounted() {
    this.comments.forEach(c => {
      if (this.replyHover[c._id] === undefined) {
        this.$set(this.replyHover, c._id, false)
      }
    })
  }
}
</script>

<style lang="scss" scoped>

.isVoted path{
  color: $secondary;
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
</style>
