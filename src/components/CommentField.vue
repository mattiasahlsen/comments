<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index"
    class="comment mb-3" :class=" { reply: comment.parentId }">
      <h6>{{comment.displayName}}</h6>
      <p class="mb-1">{{comment.text}}</p>

      <img :src="likeImg" height="14" class="mr-1 vote"
      :class="{ blue: comment.hasLiked }" @click="vote(comment, true)">
      <img :src="dislikeImg" height="14" class="mr-1 vote"
      :class="{ blue: comment.hasDisliked }" @click="vote(comment, false)">
      <span>{{comment.score}}</span>
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
      const endpoint = like ? 'like' : 'dislike'
      axios.post(URL + '/comment/' + comment._id + '/' + endpoint).then(resp => {
        if (resp.status === 200) {
          comment.score += resp.data.scoreChange
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
}
</style>
