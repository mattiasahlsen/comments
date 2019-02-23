<template>
  <div class="account-info">
    <h1>{{user.displayName}}</h1>
    <div class="account-field">
      <div class="account-key">Email:</div>
      <div class="account-value">{{user.username}}</div>
    </div>
    <div class="account-field">
      <div class="account-key">Created:</div>
      <div class="account-value">{{createdAt}}</div>
    </div>
    <div class="account-field">
      <div class="account-key">Email confirmed:</div>
      <div class="account-value">{{user.confirmed ? 'Yes' : 'No'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  computed: {
    user() {
      return this.$store.getters.user
    },
    createdAt() {
      return this.user.createdAt.toLocaleString()
    }
  },
}
</script>

<style scoped lang="scss">
.account-info {
  margin: 2em 0;
  max-width: 25em;

  .account-field {
    display: flex;
    justify-content: space-between;

    .account-key {
      font-weight: bold;
      width: 40em;
    }
    .account-value {
      white-space: nowrap;
    }
  }
}
</style>
