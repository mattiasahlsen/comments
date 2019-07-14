<template>
  <ul class="list-group mt-2">
    <h1 class="border">Latest added URLs</h1>
    <li v-for="(website, index) in websites" :key="index"
    class="list-group-item py-1 "
    @click="redirect(website.url)">

      <div class="website-item">
        <div class="website-item-url">{{urls[index]}}</div>
        <div class="info">
          <div class="website-item-date">{{website.createdAt.toLocaleString()}}</div>
          <Rating
            :likes="website.likes"
            :dislikes="website.dislikes || 0"
            :hasLiked="website.hasLiked"
            :hasDisliked="website.hasDisliked"
            @like="vote(website, true)" @dislike="vote(website, false)"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Rating from './Rating'
import { shortString } from '../lib'

export default {
  components: {
    Rating,
  },
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
    vote(website, like) {
      const likes = website.likes
      const dislikes = website.dislikes
      const hasLiked = website.hasLiked
      const hasDisliked = website.hasDisliked
      const reset = () => {
        website.likes = likes
        website.dislikes = dislikes
        website.hasLiked = hasLiked
        website.hasDisliked = hasDisliked
      }
      this.$store.dispatch('vote', {
        websiteId: website._id,
        like,
        likes, dislikes, hasLiked, hasDisliked
      }).then(data => Object.assign(website, data)).catch(err => reset())
    }
  },
}
</script>

<style scoped lang="scss">
.list-group-item {
  &:hover {
    cursor: pointer;
    background-color: rgb(245, 245, 245);
  }
}

.website-item {
  padding: 0.5em 0em;
  margin-bottom: 0.8em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0 4px 5px -2px $beige;
  &:active {
    background: rgba(211, 211, 211, 1);
  }
}

.website-item-date {
  padding: 0 0.2em;
  font-size: 0.8em;
  font-weight: bold;
  white-space: nowrap;
}

.website-item-url {
  padding: 0 0.5em;
  border-left: 1px solid $dark;
  font-size: 1.8em;
  font-weight: 300;
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 0.1em;
}
</style>
