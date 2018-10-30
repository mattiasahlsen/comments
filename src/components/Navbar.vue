<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-brand href="#">
      <router-link to="/" class="logo">Logo</router-link>
    </b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <router-link v-if="!loggedIn" to="/login" class="btn btn-primary">Log in</router-link>
      <button v-else class="btn btn-secondary" @click="$store.dispatch('logout')">Log out</button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.getters.isAuthenticated
    }
  }
}

</script>

<style scoped lang="scss">
.logo, .logo:hover {
  color: white;
  text-decoration: none;
  transition: border-bottom 0.2s;
}
.logo {
  border-bottom: 1px solid transparent;
}
.logo:hover {
  border-bottom: 1px solid #3498db;
}
</style>
