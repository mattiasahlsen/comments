<template>
  <div id="app">
    <Navbar/>
    <div class="content">
      <b-alert :show="!!error" variant="danger"
      @dismissed="$store.commit('clearError')" dismissible>
        {{error}}
      </b-alert>
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default {
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  components: {
    Navbar,
    Footer,
  },
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
</style>
