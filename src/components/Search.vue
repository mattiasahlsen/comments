<template>
  <input
  class="search form-control"
  placeholder="Enter url..."
  v-model="url"
  v-on:keyup.enter.prevent="$emit('submit', url)"/>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
}
</script>

<style scoped lang="scss">
.search{
  /*TODO Fix this later*/
  height:60px;
  display: block;
}
</style>
