<template>
 <div class="login">
   <form class="pure-form" @submit.prevent="login">
     <h1 class="mt-2">Sign in</h1>
     <input required v-model="username" type="text" placeholder="Email"/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr>
     <button class="pure-button" type="submit">Login</button>
   </form>
   <h2 class="mt-5 mb-1">Don't have an account?</h2>
   <form class="pure-form" @submit.prevent="register">
     <h3>Sign up</h3>
     <input required v-model="usernameReg" type="text" placeholder="Email"/>
     <input required v-model="passwordReg" type="password" placeholder="Password"/>
     <input required v-model="passwordConfirm" type="password" placeholder="Confirm password"/>
     <hr/>
     <button class="pure-button" type="submit">Register</button>
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
      const { usernameReg: username, passwordReg: password, passwordConfirm } = this
      if (password !== passwordConfirm) {
        return this.$store.commit('error', 'Passwords don\'t match')
      }
      this.$store.dispatch('register', { username, password }).then(() => {
        this.$router.push('/')
      }).catch(err => {
        if (err.response && err.response.status === 422 && err.response.data.errors) {
          for (let i = 0; i < err.response.data.errors.length; i++) {
            if (err.response.data.errors[i].param === 'username') {
              return this.$store.commit('error', 'Make sure the email is valid.')
            }
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

<style scoped lang="scss">
.login {
  text-align: center;
}
</style>
