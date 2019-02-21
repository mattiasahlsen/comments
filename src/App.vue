<template>
  <div id="app">
    <Navbar/>
    <div class="content">
      <b-alert :show="!!error" variant="danger"
      @dismissed="$store.commit('clearError')" dismissible>
        {{error}}
      </b-alert>
      <router-view/>
      <!-- <img v-if="image" :src="`data:image/jpg;base64, ${image}`"> -->
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
    Footer,
  },
  /*created() {
    axios.get(URL + '/thumbnail').then(resp => {
      this.image = resp.data
    })
  }*/
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1 0 auto;
}

.clickable:hover {
  cursor: pointer;
}
.scroll {
  overflow: auto;
}
</style>
