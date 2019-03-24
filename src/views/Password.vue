<template>
  <div>
    <Subnav />
    <div class="account-info">
      <h1>Change Password</h1>
      <div class="account-field">
        <div class="account-key">Your Current Password:</div>
        <div class="account-value">
          <input type="text" v-model="passwordOld" class="inlineField active" placeholder="********">
        </div>
      </div>
      <div class="account-field">
        <div class="account-key">Choose a New Password:</div>
        <div class="account-value">
          <input type="password" v-model="passwordNew" class="inlineField active" placeholder="********">
        </div>
      </div>
      <div class="account-field">
        <div class="account-key">Confirm the New Password:</div>
        <div class="account-value">
          <input type="password" v-model="passwordConfirm" class="inlineField active" placeholder="********">
        </div>
      </div>
      <button @click="updatePassword()" class="iconButton">Update Password <font-awesome-icon icon="check" /></button>
    </div>
  </div>
</template>

<script>
  import Subnav from '../components/Subnav'

  export default {
    name: 'Account',
    components: {
      Subnav,
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped lang="scss">
  .red {
    color: $warning;
  }

  .green {
    color: $success;
  }

  .iconButton{
    margin-top: 1em;
  }

  .pen {
    width: 1em;
    height: 1em;
  }

  .pen:hover > path {
    color: $secondary;
    cursor: pointer;
  }

  .active {
    background: $lighter-background !important;
    text-align: left !important;
  }

  .account-info {
    margin: 2em 0;
    background: $beige;
    padding: 2em;
    border-radius: 1em;
  }

  .account-field {
    display: flex;
    justify-content: space-between;
    font-size: 1.2em;
    height: 3em;
  }

  .account-key {
    flex: 1 0 30%;
    font-weight: 300;
    width: 40em;
    font-size: 1em;
  }

  .account-value {
    flex: 1 1 100%;
    white-space: nowrap;
    text-align: right;
  }

</style>