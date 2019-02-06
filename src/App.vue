<template>
  <div id="app">
    <Navbar/>
    <div class="content">
      <router-view/>
    </div>
    <Footer/>

    <div :class="{ dark: error }">
    </div>

    <div v-if="error" class="error-alert">
      <div>
        <font-awesome-icon icon="times" size="2x" class="dismiss" @click="dismiss"/>
        <p>{{error}}</p>
      </div>
    </div>
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
  methods: {
    dismiss() {
      this.$store.commit('clearError')
    }
  }
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
}
.content {
  flex: 1 0 auto;
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

    .dismiss {
      position: absolute;
      top: 5px;
      right: 5px;
      color: rgb(70, 70, 70);

      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
  }

}
.dark {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
