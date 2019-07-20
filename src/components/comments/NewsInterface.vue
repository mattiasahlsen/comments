<<template>
  <div>
    <h1>{{news.title || 'Title missing'}}</h1>
    <h3>{{news.description || 'Description missing'}}</h3>
    <a :href="news.url" target="_blank">Go to article</a>
    <div class="spacing-y">
      <a :href="news.url" target="_blank"><img class="newsImage" :src="news.urlToImage"></a>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['news']
  }
</script>

<style lang="scss" scoped>
.newsImage {
  max-width: 100%;
}
</style>