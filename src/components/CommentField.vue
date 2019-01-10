<template>
  <div class="comment-field">
    <div v-for="comment in comments" :key="comment._id" class="comment mb-3">
      <h5>{{comment.displayName}} <span class="date">{{comment.createdText}}</span></h5>
      <div v-if="comment.someText">
        <div v-if="!comment.showFull">
          <p v-html="comment.someText"></p>
          <p @click="comment.showFull = true" class="clickable"><strong>Show more</strong></p>
        </div>
        <div v-else>
          <p v-html="comment.text"></p>
          <p @click="comment.showFull = false" class="clickable"><strong>Show less</strong></p>
        </div>
      </div>
      <p v-else class="mb-1" v-html="comment.text"></p>

      <font-awesome-icon icon="thumbs-up" class="mr-1 vote"
      :class="{ blue: comment.hasLiked }" @click="vote(comment, true)" />
      <span class="mr-3">{{comment.likes}}</span>
      <font-awesome-icon icon="thumbs-down" class="vote mt-1 mr-1"
      :class="{ blue: comment.hasDisliked }" @click="vote(comment, false)" />
      <span class="mr-3">{{comment.dislikes}}</span>

      <div v-if="comment.children.length > 0" class="ml-3 mt-3">
        <p v-if="!comment.showChildren" @click="comment.showChildren = true" class="clickable">
          <strong>Show replies</strong>
        </p>
        <div v-if="comment.showChildren">
          <CommentField :comments="comment.children"/>
          <p v-if="comment.children.length > 0 &&
            comment.children.length % 10 === 0" @click="$emit('loadChildren', comment)"
            class="clickable load-more">Load more...</p>
        </div>
        <p v-if="comment.showChildren" @click="comment.showChildren = false" class="clickable">
          <strong>Hide replies</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config'

import likeImg from '../assets/like.png'
import dislikeImg from '../assets/dislike.png'

const URL = conf.API_URL

export default {
  name: 'CommentField',
  props: ['comments'],
  data() {
    return {
      showChildren: false,
      likeImg,
      dislikeImg
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
    }
  }
}
</script>

<style scoped lang="scss">
.comment {
  h5 {
    font-size: 0.9rem;
    font-weight: 600;
    color: $secondary-2;
  }
  .date {
    font-weight: 400;
    font-size: 0.8rem;
  }
  p {
    font-size: 0.8rem;
  }
}
.child {
  margin-left: 1.5rem;
}
.vote {
  &:hover {
    cursor: pointer;
  }
}
.blue {
  color: #0099e6;
}
.load-more {
  color: $secondary;
  font-weight: 500;
}
</style>
