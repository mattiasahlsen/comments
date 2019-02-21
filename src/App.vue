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
@import url('https://fonts.googleapis.com/css?family=Raleway:100,400,700');
#app {
	width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

</style>
