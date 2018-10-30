<template>
 <div class="login">
  <b-alert :show="error !== ''" variant="danger">
    {{error}}
  </b-alert>
   <b-form class="login-form" @submit.prevent="login">
     <h1 class="mt-2">Sign in</h1>
     <input required v-model="username" type="text" placeholder="Username"/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr>
     <button class="btn btn-primary" type="submit">Login</button>
   </b-form>
   <h2 class="mt-5 mb-1">Don't have an account?</h2>
   <b-form class="register-form" @submit.prevent="register">
     <h3>Sign up</h3>
     <input required v-model="usernameReg" type="text" placeholder="Username"/>
     <input required v-model="passwordReg" type="password" placeholder="Password"/>
     <input required v-model="passwordConfirm" type="password" placeholder="Confirm password"/>
     <hr/>
     <button class="btn primary-2" type="submit">Register</button>
   </b-form>
 </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      usernameReg: '',
      passwordReg: '',
      passwordConfirm: '',
      error: ''
    }
  },
  methods: {
    login() {
      // same as:
      // const username = this.username
      // const password = this.password
      const { username, password } = this

      this.$store.dispatch('login', { username, password }).then(() => {
        this.$router.push('/') // it was succesful
      }).catch(err => {
        this.error = err.message
      })
    },
    register() {
      const { usernameReg: username, passwordReg: password } = this
      this.$store.dispatch('register', { username, password }).then(() => {
        this.$router.push('/')
      }).catch(err => {
        console.log('ChECK*')
        this.error = err.message
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  text-align: center;
}
</style>
