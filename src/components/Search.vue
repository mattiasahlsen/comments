<template>
	<div>
		<input class="search" placeholder="Enter URL for comments..." v-model="url" v-on:keyup.enter.prevent="$emit('submit', url)" spellcheck="false"/>
	</div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
}
</script>

