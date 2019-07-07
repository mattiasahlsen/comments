<template>
  <div class="error-container" v-if="errors.length > 0" :class="{ fixed, relative: !fixed }">
    <div class="errors">
      <p class="error" v-for="(error, index) in errors" :key="index">{{error}}</p>
    </div>
    <font-awesome-icon icon="times" size="2x" class="dismiss" @click="dismiss"/>
  </div>
</template>

<script>
export default {
  props: ['fixed'],
  computed: {
    errors() {
      console.log(this.$store.getters.errors.length)
      return this.$store.getters.errors
    }
  },
  methods: {
    dismiss() {
      this.$store.commit('clearError')
    }
  },
}
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
}
.relative {
  position: relative;
}
.error-container {
  display: flex;
  background: $warning;
  width: 100%;

  .dismiss {
    margin: 0.5em;
    path {
      &:hover {
        cursor: pointer;
        color: $secondary;
      }
    }
  }
}
.errors {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

}
.error {
  padding: 1em;
  width: 100%;
  color: $white;
  text-align: center;
}
</style>

