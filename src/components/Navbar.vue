<template>
  <nav class="main">
    <div class="logo">
      <router-link to="/"><img src="../assets/logo-demo3.png" alt="Logotype" /></router-link>
    </div>

    <nav>
      <router-link class="linkButton" v-if="!loggedIn" to="/login">Log in</router-link>
      <div class="loginout" v-else>
        <router-link to="/account" class="linkButton">{{user.displayName}}</router-link>
        <button style="margin-left: 0.5%;" class="linkButton" @click="$store.dispatch('logout')">Log out</button>
      </div>
    </nav>
  </nav>
</template>

<script>
export default {
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
