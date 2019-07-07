<template>
  <div id="app">
    <Error :fixed="false"/>
    <Error :fixed="true"/>
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
      image: null
    }
  },
  components: {
    Navbar,
    Error,
  },
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

footer {
  margin-top: 5vh;
}
</style>
