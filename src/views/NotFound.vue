<template>
  <div class="errorPage">
    <img class="image404" :src="page404" alt="Page 404 Image">
    <h1>Sorry! The page you were trying to reach was not found!</h1>
    <router-link to="/">Go home</router-link>
  </div>
</template>

<script>
import page404 from '../assets/images/page-404.png'

export default {
  data() {
    return {
      page404: page404
    }
  },
}
</script>

<style lang="scss" scoped>
.errorPage {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.image404 {
  width: 100%;
  max-width: 500px;
  margin-bottom: 3em;
}
</style>
