<template>
  <div class="toggleItem">
    <div @click="activated = !activated" class="toggleItemHeader">
      <div class="status" v-if="activated">-</div><div class="status" v-else>+</div><h2>{{ header }}</h2>
    </div>
    <div :class="{ show: activated, toggleItemContent: true }">
    <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: ['header'],
    data() {
      return {
        activated: false,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .toggleItem {
    width: 100%;
    margin-bottom: 1.5em;
  }

  h2 {
    margin: 0;
  }

  .toggleItemHeader {
    font-weight: 300;
    margin-bottom: 0.4em;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    &:hover {
      cursor: pointer;
    }
  }

  .toggleItemContent {
    transition: opacity 0.5s ease-in-out;
    opacity: 0;
    height: 0;
    overflow: hidden;
    margin-left: 2em;
    line-height: 1.3em;
  }

  .status {
    display: inline;
    font-weight: bold;
    font-size: 2em;
    flex: 0 0 1em;
  }

  .show {
    opacity: 1;
    height: auto;
  }

</style>