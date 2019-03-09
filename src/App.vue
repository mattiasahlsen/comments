<template>
  <div id="app">
    <div class="notification warning" v-if="error">
      <p class="notification-text">{{error}}</p>
      <font-awesome-icon icon="times" size="2x" class="dismiss" @click="dismiss"/>
    </div>
      <Navbar/>
    <div class="wrapper">
      <div class="content">
        <router-view/>
      </div>
    </div>

    <footer>
      <div>
      All rights reserved &copy; urlexp.com
      </div>

      <div>
        <router-link to="/support" class="link">Support</router-link> -
        <router-link to="/about" class="link">About</router-link> -
        <router-link to="/legal/terms-of-use" class="link">Terms of Use</router-link> -
        <router-link to="/legal/privacy-policy" class="link">Privacy Policy</router-link> -
        <a href="https://cookiesandyou.com/" target="_blank">Use of cookies</a>
      </div>
    </footer>

  </div>
</template>

<script>
import axios from 'axios'
import Navbar from './components/Navbar'
import conf from './config'
const URL = conf.API_URL

export default {
  data() {
    return {
      image: null
    }
  },
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  components: {
    Navbar,
  },
  /* created() {
    axios.get(URL + '/thumbnail').then(resp => {
      this.image = resp.data
    })
  }*/
  methods: {
    dismiss() {
      this.$store.commit('clearError')
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,700');

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

footer {
  margin-top: 5vh;
}
</style>