<template>
  <ul class="list-group mt-2">
    <li v-for="(website, index) in websites" :key="index"
    class="list-group-item py-1"
    @click="redirect(website.url)">
      <h6 class="m-0">{{website.createdText}}</h6>
      <p class="m-0 scroll"><i>{{website.url}}</i></p>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['websites'],
  methods: {
    redirect(url) {
      this.$emit('redirect', url)
    }
  }
}
</script>

<style scoped lang="scss">
.list-group-item {
  &:hover {
    cursor: pointer;
    background-color: rgb(245, 245, 245);
  }
}
</style>
