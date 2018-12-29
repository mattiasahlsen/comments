<template>
  <ul class="list-group mt-2">
    <li v-for="(website, index) in websites" :key="index"
    class="list-group-item py-1"
    @click="redirect(website.url)">
      <h6 class="m-0">{{website.creationDate}}</h6>
      <a :href="website.url" @click.stop class="m-0">{{website.url}}</a>
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
  }
}
</style>
