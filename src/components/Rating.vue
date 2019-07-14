<<template>
  <div class="rating">
    <div class="vote-box flex">
      <font-awesome-icon icon="thumbs-up" class="vote"
      :class="{ isVoted: hasLiked }" @click.stop="$emit('like')"/>
      <span class="mr-3">{{likes}}</span>
    </div>
    <div class="vote-box flex">
      <font-awesome-icon icon="thumbs-down" class="vote"
        :class="{ isVoted: hasDisliked }" @click.stop="$emit('dislike')"/>
      <span class="mr-3">{{dislikes}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['likes', 'dislikes', 'hasLiked', 'hasDisliked'],
    mounted() {
      //console.log(this.hasLiked)
    }
  }
</script>

<style lang="scss" scoped>
.isVoted path{
  color: $secondary;
}
.rating {
  margin-top: 0.2em;
  display: flex;
}

.vote-box {
  margin: 0.1em;

  .vote {
    margin: 0.1em;
    &:hover {
      cursor: pointer;
    }
  }
}
.thumbs-up:hover,
.thumbs-down:hover {
  color: $secondary;
  cursor: pointer;
}
</style>