<template>
  <footer class="footer">
    <div class="rights">All rights reserved &copy; domain.com</div>
    <div class="flex">
      <div>
        <router-link to="/legal/terms-of-use">Terms of Use</router-link> -
        <router-link to="/legal/privacy-policy">Privacy Policy</router-link> -
        <router-link to="/legal/use-of-cookies">Use of cookies</router-link>
      </div>
      <div>
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
  flex-shrink: 0; //Prevents shrinking on some browsers
  text-align: center;
  background-color: $dark-1;
  color: $light-2;
}
.flex {
  display: flex;
  justify-content: space-between;
}
a {
  color: $light-2;
}
.rights {
  margin-top: 3px;
}

@media (max-width: $sm) {
  .rights {
    margin-bottom: 3px;
  }
  .flex a {
    display: block;
  }
}
</style>
