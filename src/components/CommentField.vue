<template>
  <div class="comment-field">
    <div v-for="comment in comments" :key="comment._id" class="mb-3">
      <div class="comment">
        <div class="comment-score">
          {{comment.likes - comment.dislikes}}
        </div>

        <div class="comment-body">
          <!-- <div class="commenter">{{comment.displayName}} <span class="date">{{comment.createdText}}</span></div> -->
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
        <div class="comment-reply" :class="{ replyHover: replyHover[comment._id] }">
          <span @mouseover="hoverReply(comment)" @mouseleave="unhoverReply(comment)">
            <font-awesome-icon icon="reply" class="reply" />
          </span>
        </div>
      </div>

      <div class="comment-replies">
        <div v-if="comment.children.length > 0" class="ml-3 mt-3">
          <div v-if="!comment.showChildren" @click="comment.showChildren = true">
            <div class="clickable showReplies">Show Replies</div>
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
            <div class="clickable hideReplies">Hide Replies</div>
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
    }
  },
  data() {
    return {
      showChildren: false,
      replyHover: {},
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

.comment-score {
  // background-image: url("../assets/score-bg.png");
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-position: center;
  // text-align: center;
}
.replyHover {
  cursor: pointer;
  path {
    color: $secondary;
  }
}
</style>
