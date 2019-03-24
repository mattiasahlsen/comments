<template>
  <div class="subnav box">
    <h4>Navigate: </h4>
    <template v-for="(link, index) in getLinks()">
        <span v-if="subnavLink(link)">
          <span v-show="index !== 0"> - </span>
          <strong title="Current link">{{ ucLink(link) }}</strong>
        </span>
        <span v-else>
          <span v-show="index !== 0"> - </span>
          <router-link class="unlink" :to="toLink(link)" :title="linkTitle(link)">{{ ucLink(link) }}</router-link>
        </span>
    </template>
  </div>
</template>

<script>
  import { ucFirstWord } from '../lib'

  export default {
    data() {
      return {
        infoLinks: ['about','faq','support','terms of use','privacy policy','press'],
        accountLinks: ['links','account','password']
      }
    },
    methods: {
      subnavLink(link) {
       return this.$route.path === '/'+link ? true : false
      },
      ucLink(link) {
        return ucFirstWord(link)
      },
      toLink(link) {
        return link.replace(/\s+/, '-')
      },
      linkTitle(link) {
        return 'Go to page: ' + this.ucLink(link)
      },
      getLinks() {
        const page = this.$route.path.substr(1)
        if (this.infoLinks.includes(page)) {
          return this.infoLinks
        } else if (this.accountLinks.includes(page)) {
          return this.accountLinks
        } else {
          console.log('Error in getLinks()')
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

  h4 {
    display: inline;
    font-size: 1.2em;
    margin-right: 0.2em;
  }

  .subnav {
    padding: 1em !important;
    margin: 0 !important;
  }

  strong {
    font-weight: 800 !important;
  }

  .unlink {
    font-weight: 400 !important;
  }

</style>
