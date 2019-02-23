<template>
  <ul class="list-group mt-2">
    <li v-for="(website, index) in websites" :key="index"
    class="list-group-item py-1 "
    @click="redirect(website.url)">

      <div class="website-item">
        <div class="website-item-date">{{website.createdText}}</div>
        <div class="website-item-url">{{website.url}}</div>
      </div>
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
