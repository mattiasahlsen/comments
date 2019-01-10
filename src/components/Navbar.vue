<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-brand>
      <router-link to="/" class="logo">Comments</router-link>
    </b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <router-link v-if="!loggedIn" to="/login" class="btn btn-primary">Log in</router-link>
      <div v-else>
        <button class="btn btn-secondary mr-2" @click="$store.dispatch('logout')">Log out</button>
        <button class="btn btn-light">{{user.displayName}}</button>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user
    },
    loggedIn() {
      return this.$store.getters.isAuthenticated
    },
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
  border-bottom: 1px solid #f2f2f2;
}
</style>
