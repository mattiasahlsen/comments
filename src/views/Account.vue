<template>
  <div>
    <div class="account-info">
      <h1>Profile</h1>
      <div class="account-field">
        <div class="account-key">Username:</div>
        <div class="account-value" v-if="!editProfile">{{user.displayName}}</div>
        <input type="text" v-model="displayName" :placeholder="user.displayName" v-else>
      </div>
      <div class="account-field">
        <div class="account-key">Email:</div>
        <div class="account-value" v-if="!editProfile">{{user.username}}</div>
        <input type="email" v-model="username" :placeholder="user.username" v-else>
      </div>
      <div class="account-field">
        <div class="account-key">Created:</div>
        <div class="account-value">{{createdAt}}</div>
      </div>
      <div class="account-field">
        <div class="account-key">Email confirmed:</div>
        <div class="account-value">{{user.confirmed ? 'Yes' : 'No'}}</div>
      </div>
      <button @click="editProfile = true" v-show="!editProfile" class="iconButton">Edit Profile</button>
      <button @click="saveProfile" v-show="editProfile" class="iconButton">Save Profile</button>
    </div>
    <p style="margin-top:2em">

      If you would like to delete your account or know what's stored about you, please contact support@urlexp.com.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      displayName: '',
      username: '',
      editProfile: false
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    createdAt() {
      return this.user.createdAt.toLocaleString()
    }
  },
  methods: {
    saveProfile() {
      this.$store.commit('clearError')

      if (this.displayName.trim() === '') {
        return this.$store.commit('error', 'You must enter a display name!')
      } else if (this.username.trim() === '') {
        return this.$store.commit('error', 'You must enter an email!')
      } else if (!this.username.includes('@')) {
        return this.$store.commit('error', 'Please enter a valid email!')
      } else {



        
      }
    }
  }
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
