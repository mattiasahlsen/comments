<template>
  <div id="app">
    <Error :fixed="false"/>
    <Error :fixed="true"/>
    <Navbar/>

    <div class="wrapper">
      <div class="content">
        <router-view/>
      </div>

      <div>
        <a v-if="$route.path !== '/'" href="#" @click.prevent="toHome" class="iconButton">Home</a>
        <button v-if="nearBottom" v-scroll-to="'#app'" class="iconButton">Go to top</button>
      </div>
    </div>


    <footer class="main">
      <div>
      All rights reserved &copy; urlexp.com
      </div>

      <a target="_blank" href="https://newsapi.org">Powered by News API</a>

      <div>
        <router-link to="/about">About</router-link> -
        <router-link to="/faq">FAQ</router-link> -
        <router-link to="/support">Support</router-link> -
        <router-link to="/legal/terms-of-use">Terms of Use</router-link> -
        <router-link to="/legal/privacy-policy">Privacy Policy</router-link> -
        <a href="https://cookiesandyou.com/" target="_blank">Cookies</a>
      </div>
    </footer>

  </div>
</template>

<script>
import axios from 'axios'
import Navbar from './components/Navbar'
import Error from './components/Error'
import conf from './config'
const URL = conf.API_URL

export default {
  data() {
    return {
      image: null,
      nearBottom: false,
    }
  },
  components: {
    Navbar,
    Error,
  },
  methods: {
    toHome() {
      this.$router.push('/')
      window.scrollTo(0, 0)
    }
  },
  mounted() {
    this.$store.commit('onScroll', {
      index: 2,
      fun: () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.9 && window.scrollY > 0) {
          this.nearBottom = true
        } else {
          this.nearBottom = false
        }
      }
    })
  }
}
</script>

<style lang="scss">
//@import url('https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,700');
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,700');
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
}

.wrapper {
  width: 80%;
  margin: 0 auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
footer {
  margin-top: 5vh;
}
</style>
