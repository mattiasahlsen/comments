<template>
  <div>
    <Subnav />
    <div class="faq box">
      <h1>Frequently Asked Questions</h1>
      <ToggleItem header="Why should I use this website?">
        Whenever you have something to say about a website or you want to check whether a website is legit or not, urlexp.com is an awesome tool for just that! The goal of this website is to try create a more secure internet.
      </ToggleItem>
      <ToggleItem header="I haven't received the verification mail.">
        No worries! Please check your spam folder in order to make sure it haven't ended up there. If no success, just go to your <router-link to="/account">profile</router-link> and click on the button that says "Send new Verification Email". If after all this you still can't find it, please go ahead and send our support a message and they will help you!
      </ToggleItem>
      <ToggleItem header="I would like to know what is stored about me in your database.">
        That's absolutely fine! Please contact our support at <a href="mailto:support@urlexp.com">support@urlexp.com</a> and they will gladly help you with that matter!
      </ToggleItem>

    </div>
  </div>
</template>

<script>
  import Subnav from '../components/Subnav';
  import ToggleItem from '../components/ToggleItem'

  export default {
    name: 'Support',
    components: {
      Subnav,
      ToggleItem,
    },
    data() {
      return {

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
