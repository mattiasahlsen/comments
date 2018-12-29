<template>
 <div class="login">
   <b-form class="login-form" @submit.prevent="login">
     <h1 class="mt-2">Sign in</h1>
     <input required v-model="username" type="text" placeholder="Email"/>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr>
     <button class="btn btn-primary" type="submit">Login</button>
   </b-form>
   <h2 class="mt-5 mb-1">Don't have an account?</h2>
   <b-form class="register-form" @submit.prevent="register">
     <h3>Sign up</h3>
     <input required v-model="usernameReg" type="text" placeholder="Email"/>
     <input required v-model="displayName" type="text" placeholder="Display name"/>
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
  }
}
</script>

<style scoped lang="scss">
.login {
  text-align: center;
}
</style>
