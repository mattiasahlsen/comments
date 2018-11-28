<template>
  <footer class="footer bg-dark container-fluid">
    <div class="text-light text-center small">All rights reserved &copy; domain.com</div>
    <div class="row mt-2">
      <div class="col-6 text-light text-left">
        <router-link to="/legal/terms-of-use" class="link">Terms of Use</router-link> -
        <router-link to="/legal/privacy-policy" class="link">Privacy Policy</router-link> -
        <router-link to="/legal/use-of-cookies" class="link">Use of cookies</router-link>
      </div>
      <div class="col-6 text-light text-right">
        <router-link to="/about" class="link">About</router-link> -
        <router-link to="/press" class="link">Press</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  height:5%;
  padding:1%;
  flex-shrink: 0; /*Prevents shrinking on some browsers*/
  font-weight:300;
}
.row{
  margin:0;
}
a {
  color: white;
}

@media (max-width: 575px) {
  .footer {
    text-align: center;
  }
  .link {
    display: block;
  }
}
</style>
