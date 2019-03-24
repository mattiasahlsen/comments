<template>
  <div>
    <Subnav />
    <div class="about box">
      <h1>About urlexp.com</h1>
      <p>
        Welcome to urlexp.com! Since a lot of websites don't have integration with their users or for example YouTube where people are able to disable commenting on their videos, it is sometimes very hard to find credibility about some websites. Our website is a tool for that problem, urlexp.com makes the internet more secure with the help of you! Together we maintain the URLs of the internet and make sure that important information reaches whoever needs it.
      </p>

      <h2>So how do you use our website?</h2>
      <p>
        It is extremely easy to use this website. Whenever you want to know more about a specific URL (like credibility or just what other think about it) this is the place to go. Just <strong>copy</strong> the URL in question, and paste it here on urlexp.com. You will then see what other people has to say about the URL and from there you are more than welcome to express your own thoughts about it.
      </p>
    </div>
  </div>
</template>

<script>
  import Subnav from '../components/Subnav'

  export default {
    name: 'About',
    components: {
      Subnav
    },
    data() {
     return {

     }
    },
  }
</script>

<style lang="scss" scoped>
  p{
    margin-bottom: 1em;
  }
</style>
