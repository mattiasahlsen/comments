<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index" class="comment mb-3">
      <h6>{{comment.displayName}}</h6>
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
        <p v-if="!showChildren" @click="showChildren = true" class="clickable">
          <strong>Show replies</strong>
        </p>
        <div v-if="showChildren">
          <CommentField :comments="comment.children"/>
          <p v-if="comment.children.length > 0 &&
            comment.children.length % 10 === 0" @click="$emit('loadChildren', comment)"
            class="clickable load-more">Load more...</p>
        </div>
        <p v-if="showChildren" @click="showChildren = false" class="clickable">
          <strong>Hide replies</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import likeImg from '../assets/like.png'
import dislikeImg from '../assets/dislike.png'

const URL = process.env.VUE_APP_API_URL

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
      let endpoint
      if ((like && comment.hasLiked) || (!like && comment.hasDisliked)) endpoint = 'undovote'
      else if (like) endpoint = 'like'
      else endpoint = 'dislike'

      axios.post(URL + '/comment/' + comment._id + '/' + endpoint).then(resp => {
        if (resp.status === 200) {
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
        } else this.$store.commit('status', resp.status)
      }).catch(err => {
        this.$store.commit('error', err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.comment {
  h6 {
    font-size: 0.8rem;
    font-weight: 600;
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
  color: $secondary-2;
  font-weight: 500;
}
</style>
