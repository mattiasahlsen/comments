<template>
  <div>
    <Subnav />
    <div class="box">
      <h1>Links</h1>
      <h2>Add a link</h2>
      <input type="text" @keyup.enter="addLink" class="inlineField active" v-model="newLink" placeholder="Enter a link to save">
      <h2>Your links</h2>
    </div>
  </div>
</template>

<script>
  import Subnav from '../components/Subnav'
  import { linkValidator } from '../lib.js'

  export default {
    name: 'About',
    components: {
      Subnav
    },
    data() {
      return {
        newLink: '',
      }
    },
    methods: {
      addLink() {
        this.$store.commit('clearError')
        const link = this.newLink.trim()
        if(linkValidator(link)) {

        } else {
          this.$store.commit('error', 'Please enter a valid link!')
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  .active {
    background: $lighter-background !important;
    text-align: left !important;
  }

  p{
    margin-bottom: 1em;
  }
</style>
