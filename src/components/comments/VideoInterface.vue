<template>
	<div>
		<div class="videoControlPanel">
			<button class="inline iconButton" @click="videoVisibility = !videoVisibility">Toggle video</button>
			<div class="videoSizeControl inline" v-if="videoVisibility">
				Video Size:
				<select v-model="youtubeVideoWidth">
					<option value="100%">100%</option>
					<option value="90%">90%</option>
					<option value="80%" selected>80%</option>
					<option value="70%">70%</option>
					<option value="60%">60%</option>
					<option value="50%">50%</option>
				</select>
			</div>
		</div>

		<div v-show="videoVisibility">
			<div class="auto-resizable-iframe" :style="{ width: youtubeVideoWidth }">
			<div>
					<youtube :video-id="youtubeVideoId()" class="video"></youtube>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed'

export default {
	data() {
		return {
      youtubeVideoWidth: '70%',
      videoVisibility: true,
		}
	},
	methods: {
		youtubeVideoId() {
		  return getIdFromURL('https://' + this.$route.params.url)
		},
	}
}
</script>

<style scoped>
</style>
