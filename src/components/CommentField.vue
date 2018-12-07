<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index"
    class="comment mb-3" :class=" { reply: comment.parentId }">
      <h6>{{comment.displayName}}</h6>
      <p class="mb-1">{{comment.text}}</p>

      <font-awesome-icon icon="thumbs-up" class="mr-1 vote"
      :class="{ blue: comment.hasLiked }" @click="vote(comment, true)" />
      <span class="mr-3">{{comment.likes}}</span>
      <font-awesome-icon icon="thumbs-down" class="vote mt-1 mr-1"
      :class="{ blue: comment.hasDisliked }" @click="vote(comment, false)" />
      <span class="mr-3">{{comment.dislikes}}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import likeImg from '../assets/like.png'
import dislikeImg from '../assets/dislike.png'

const URL = process.env.VUE_APP_API_URL

export default {
  props: ['comments'],
  data() {
    return {
      likeImg,
      dislikeImg
    }
  },
  methods: {
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
.reply {
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
</style>
