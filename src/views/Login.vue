<template>
 <div class="login">
   <form class="login-form" @submit.prevent="login">
     <h1>Sign in</h1>
     <input required v-model="username" type="text" placeholder="Email"/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <button type="submit">Login</button>
   </form>
   <hr>
   <form class="registration-form" @submit.prevent="register">
      <h1>Sign up</h1>
      <input required v-model="usernameReg" type="text" placeholder="Email"/>
      <input required v-model="displayName" type="text" placeholder="Display name"/>
      <input required v-model="passwordReg" type="password" placeholder="Password"/>
      <input required v-model="passwordConfirm" type="password" placeholder="Confirm password"/>
      <button class="" type="submit">Register</button>
      <span class="small">By clicking "Register" you accept the <router-link to="">Terms of Use</router-link></span>
   </form>
 </div>
</template>

<script>
import store from '../store'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      usernameReg: '',
      displayName: '',
      passwordReg: '',
      passwordConfirm: '',
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
        this.$store.commit('axiosError', err)
      })
    },
    register() {
      if (this.passwordReg !== this.passwordConfirm) {
        return this.$store.commit('error', 'Passwords don\'t match')
      }
      if (!this.usernameReg.includes('@')) {
        return this.$store.commit('error', 'Make sure username is a valid email address')
      }

      const { usernameReg: username, displayName, passwordReg: password } = this
      this.$store.dispatch('register', { username, displayName, password }).then(() => {
        this.$router.push('/')
      }).catch(err => {
        if (err.response) {
          if (err.response.status === 422 && err.response.data.errors) {
            for (let i = 0; i < err.response.data.errors.length; i++) {
              if (err.response.data.errors[i].param === 'username') {
                return this.$store.commit('error', 'Make sure the email is valid.')
              }
            }
          } else if (err.response.status === 409) {
            return this.$store.commit('error', 'There already exists an account for that email address.')
          }
        }
        this.$store.commit('axiosError', err)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (store.getters.user) next(false)
    else next()
  }
}
</script>
