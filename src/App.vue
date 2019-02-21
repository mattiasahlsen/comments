<template>
  <div id="app">
		<div class="notification warning" v-if="error" :show="!!error"
      @dismissed="$store.commit('clearError')" dismissible>
        {{error}}
      </div>
			<Navbar/>
		<div class="wrapper">
    	<div class="content">
      	<router-view/>
    	</div>
    	<Footer/>
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
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Raleway:100,400,700');
#app {
	width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

</style>
