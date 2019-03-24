<template>
  <nav class="main">
    <router-link to="/"><img :src="logo" alt="Logotype" /></router-link>
    <nav>
      <router-link class="linkButton" v-if="!loggedIn" to="/login">Log in</router-link>
      <div class="loginout" v-else>
        <router-link to="/account" class="linkButton">Profile</router-link>
        <button class="linkButton" @click="logOut">Log out</button>
      </div>
    </nav>
  </nav>
</template>

<script>
import logo from '../assets/images/logo.png'

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
  },
  methods: {
    logOut() {
      this.$store.dispatch('logout')
      this.$router.push({ path: '/' })
    }
  }
}
</script>
