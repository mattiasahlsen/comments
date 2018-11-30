<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index" class="comment">
      <p><strong>{{comment.displayName}}</strong></p>
      <p>{{comment.text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['comments'],
}
</script>

<style scoped lang="scss">
.comment {
}
</style>
