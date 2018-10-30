<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">
      <router-link to="/" class="link">Logo</router-link>
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
a {
  color: white;
}
</style>
