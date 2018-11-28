<template>
  <div class="comment-field">
    <div v-for="(comment, index) in comments" :key="index">

    </div>
  </div>
</template>

<script>
export default {
  props: ['comments'],
}
</script>

<style scoped>
</style>
