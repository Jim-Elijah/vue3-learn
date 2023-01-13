<template>
  <router-link to="/">home</router-link>
  <router-link to="/AudioPlayer">AudioPlayer</router-link>
  <router-link to="/AudioEasyPlayer">AudioEasyPlayer</router-link>
  <router-link to="/AudioDrag">AudioDrag</router-link>
  <router-link to="/JimsAudioPlayer">JimsAudioPlayer</router-link>
  <router-link to="/draggableDemo">draggableDemo</router-link>
  <router-link to="/lottieDemo">lottieDemo</router-link>
  <router-link to="/CarouselDemo">CarouselDemo</router-link>
  <router-link to="/animationImage">animationImage</router-link>
  <router-link to="/radarDemo">radarDemo</router-link>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  components: {
  },
};
</script>

<style scoped>
a {
  margin-right: 10px;
}
</style>
