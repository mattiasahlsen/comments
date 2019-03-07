<template>
  <nav class="main">
    <div class="logo">
      <router-link to="/"><img :src="logo" alt="Logotype" /></router-link>
    </div>

    <nav>
      <router-link class="linkButton" v-if="!loggedIn" to="/login">Log in</router-link>
      <div class="loginout" v-else>
        <router-link to="/account" class="linkButton">{{user.displayName}}</router-link>
        <button class="linkButton" @click="$store.dispatch('logout')">Log out</button>
      </div>
    </nav>
  </nav>
</template>

<script>

import logo from '../assets/logo.png'

export default {
	data() {
    return {
      logo: logo
    }
	},
  computed: {
    user() {
      return this.$store.getters.user
    },
    loggedIn() {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>
