<template>
  <ul class="list-group mt-2">
    <h1>Latest added URLs</h1>
    <li v-for="(website, index) in websites" :key="index"
    class="list-group-item py-1 "
    @click="redirect(website.url)">

      <div class="website-item">
        <div class="website-item-date">{{website.createdAt.toLocaleString()}}</div>
        <div class="website-item-url">{{urls[index]}}</div>
      </div>
    </li>
  </ul>
</template>

<script>
import { shortString } from '../lib'

export default {
  props: ['websites'],
  computed: {
    urls() {
      let limit
      if (window.innerWidth > 1140) limit = 45
      else if (window.innerWidth > 960) limit = 35
      else if (window.innerWidth > 650) limit = 23
      else limit = 15

      return this.websites.map(el => shortString(el.url, limit))
    }
  },
  methods: {
    redirect(url) {
      this.$emit('redirect', url)
    },
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
