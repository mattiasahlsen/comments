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
  font-family: 'Roboto', sans-serif;
}

footer {
  margin-top: 5vh;
}

.error-alert {
  position: fixed;
  width: 100vw;
  margin: 30vh auto 0;
  display: flex;
  justify-content: center;

  div {
    padding: 10px 30px;
    min-width: 300px;
    background-color: rgb(250, 250, 250);
    position: relative;
    border-radius: 3px;

    p {
      text-align: center;
      font-size: 1.2em;
    }

    /*.dismiss {
      position: absolute;
      top: 5px;
      right: 5px;
      color: rgb(70, 70, 70);

      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }*/
  }

}
.dark {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
}

.cc-message{
  color: #ffffff;
}

.cc-link{
  text-decoration: none !important;
  opacity: 1 !important;
  color: #ecf0f1 !important;
  &:hover {
    color: $secondary !important;
  }
}

</style>
