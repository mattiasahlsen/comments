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
import { SM, MD } from '../../constants'

export default {
	data() {
		return {
      youtubeVideoWidth: window.innerWidth > MD ? '70%' : window.innerWidth > SM ? '90%' : '100%',
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

<style lang="scss" scoped>
.videoControlPanel{
  width: 100%;
  background: $beige;
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.videoSizeControl{
  margin-right: 0.2em;
}
</style>
<style lang="scss">
.auto-resizable-iframe {
  margin: 0px auto;
}

.auto-resizable-iframe > div {
  position: relative;
  padding-bottom: 75%;
  height: 0;
}

.auto-resizable-iframe iframe{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
