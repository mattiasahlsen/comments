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
  	</div>
			<!-- FOOTER START-->
		<footer>
			<div>
			All rights reserved &copy; domain.com
			</div>
			<div>
				<!-- TODO Can these be normal anchor tags, or should they be router-links? -->
				<router-link to="/about" class="link">About</router-link> -
				<router-link to="/legal/terms-of-use" class="link">Terms of Use</router-link> -
				<router-link to="/legal/privacy-policy" class="link">Privacy Policy</router-link> -
				<router-link to="/legal/use-of-cookies" class="link">Use of cookies</router-link>
			</div>
		</footer>
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
	height: 100%;
  display: flex;
  flex-direction: column;
}



</style>
