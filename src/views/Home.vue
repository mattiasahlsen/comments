<template>
  <div class="home">
    <h1 class="mt-2">Vue app boilerplate</h1>
    <h2>Features</h2>
    <ul>
      <li v-for="(feature, index) in features" :key="index">
        <a :href="feature.link">{{feature.text}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  data() {
    return {
      features: [
        { text: 'Bootstrap-vue: ', link: 'https://bootstrap-vue.js.org/' },
        { text: 'Mongodb with mongoose: ', link: 'https://mongoosejs.com/' },
        { text: 'Local authentication with passport-local: ', link: 'http://www.passportjs.org/packages/passport-local/' },
        { text: 'Vue cli features like sass, vuex, eslint, webpack and jest-testing', link: 'https://cli.vuejs.org/guide/' },
        { text: 'In-memory mongodb database for testing', link: 'https://www.npmjs.com/package/mongodb-memory-server' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  text-align: center;
}
ul {
  display: inline-block;
  text-align: left;
}
</style>
