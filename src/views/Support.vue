<template>
  <div>
    <Subnav />
    <div class="support box">
      <h1>Support</h1>
      <p>Do you have any questions? Please read through the <router-link to="/faq">FAQ</router-link> (Frequently Asked Questions) for answers. If the FAQ didn't give you the information you searched for, feel free to contact our support so we can help you further!</p>

    </div>
  </div>
</template>

<script>
  import Subnav from '../components/Subnav';

  export default {
    name: 'Support',
    components: {
      Subnav,
    },
    data() {
      return {

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
