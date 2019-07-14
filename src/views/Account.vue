<template>
  <div>
    <Subnav />
    <div class="account-info box">
      <h1>Account</h1>
      <div class="account-field">
        <div class="account-key">Display Name:</div>
        <div class="account-value">
          <input type="text" v-model="displayName" :class="{ active: editing, inlineField: true }" :disabled="!editing">
        </div>
      </div>
      <div class="account-field">
        <div class="account-key">Email:</div>
        <div class="account-value">
          <input type="email" v-model="username" :class="{ active: editing, inlineField: true }" :disabled="!editing">
        </div>
      </div>
      <div class="account-field">
        <div class="account-key">Created:</div>
        <div class="account-value">{{createdAt}}</div>
      </div>
      <div class="account-field">
        <div class="account-key">Email confirmed:</div>
        <div class="account-value">
          <span :class="{ red: !user.confirmed, green: user.confirmed }">{{user.confirmed ? 'Yes' : 'No'}}</span>
        </div>
      </div>
      <button @click="editing = true" v-show="!editing" class="iconButton">Edit Profile</button>
      <button @click="saveProfile()" v-show="editing" class="iconButton">Save Profile</button>
    </div>
    <div class="observe">
      If you would like to delete your account or know what's stored about you, please contact <a href="mailto:support@urlexp.com" title="Mail support: support@urlexp.com">support@urlexp.com</a>.
    </div>
  </div>
</template>

<script>
import Subnav from '../components/Subnav'
import { validateDisplayName } from '../lib.js'

export default {
  name: 'Account',
  components: {
    Subnav,
  },
  data() {
    return {
      editing: false,
      displayName: '',
      username: '',
      editField: {
        displayName: false,
        username: false,
      }
    }
  },
  created() {
    //I need to fix this problem (sometimes null)
    this.displayName = this.user && this.getDisplayName
    this.username = this.user && this.getUsername
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    getDisplayName() {
        return this.user && this.user.displayName
    },
    getUsername() {
      return this.user && this.user.username
    },
    createdAt() {
      return this.user && this.user.createdAt.toLocaleString()
    }
  },
  methods: {
    saveProfile() {
      this.$store.commit('clearError')
      const oldDisplayName = this.user.displayName.trim().toLowerCase()
      const oldUsername = this.user.username.trim().toLowerCase()
      const newDisplayName = this.displayName.trim().toLowerCase()
      const newUsername = this.username.trim().toLowerCase()

      if (oldDisplayName !== newDisplayName || oldUsername !== newUsername) {
        if (validateDisplayName(newDisplayName) !== '') {
          this.$store.commit('error', 'error')
        } else {

        }
      } else {
        this.editing = false
      }
    }
  }
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

}

.account-field {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  height: 3em;
}

.account-key {
  flex: 1 0 40%;
  font-weight: 300;
  width: 40em;
  font-size: 1em;
  white-space: nowrap;
}

.account-value {
  flex: 1 1 100%;
  white-space: nowrap;
  text-align: right;
}
.observe {
  font-style: italic;
  font-size: 0.8em;
  margin-top: 2em;
}
</style>