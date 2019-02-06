<template>
  <nav class="navbar">
    <router-link to='/'>
      <h2 class="logo">Logo</h2>
    </router-link>

    <div class="links">
      <router-link class="pure-button" v-if="!loggedIn" to="/login">Log in</router-link>
      <div v-else>
        <button class="pure-button mr" @click="$store.dispatch('logout')">Log out</button>
        <button class="pure-button">{{user.username}}</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.getters.isAuthenticated
    },
    user() {
      return this.$store.getters.user
    }
  },
}

</script>

<style scoped lang="scss">
.navbar {
  background-color: #4d4d4d;
  display: flex;
  justify-content: space-between;
  align-items: 'center';
  padding: 0 10px;
}
.links {
  display: flex;
  align-items: center;
}
.logo, .logo:hover {
  color: white;
  text-decoration: none;
  transition: border-bottom 0.2s;
}
.logo {
  display: inline-block;
  border-bottom: 1px solid transparent;
}
.logo:hover {
  border-bottom: 1px solid #3498db;
}
.mr {
  margin-right: 5px;
}
</style>
