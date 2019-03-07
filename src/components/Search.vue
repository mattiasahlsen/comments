<template>
  <div>
    <input class="search" v-bind:placeholder="currentUrl()" v-model="url" v-on:keyup.enter.prevent="$emit('submit', url)" spellcheck="false"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  methods: {
    currentUrl() {
      const page = this.$route.params.url
      return page === '' ? 'Enter URL for comments...' : page
    }
  },
}
</script>
