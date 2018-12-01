<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index"
    class="comment mb-3" :class=" { reply: comment.parentId }">
      <h6>{{comment.displayName}}</h6>
      <p class="mb-1">{{comment.text}}</p>

      <img :src="likeImg" height="12" class="mr-1">
      <span class="mr-3">{{comment.upvotes}}</span>

      <img :src="dislikeImg" height="12" class="mr-1">
      <span>{{comment.downvotes}}</span>
    </div>
  </div>
</template>

<script>
import likeImg from '../assets/like.png'
import dislikeImg from '../assets/dislike.png'

export default {
  props: ['comments'],
  data() {
    return {
      likeImg,
      dislikeImg
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
</style>
