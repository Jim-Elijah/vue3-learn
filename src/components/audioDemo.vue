<template>
  <div class="page" @click="handleChangeAudioVolume">
    <!-- <audio-player ref="audio" class="audio-box" fileurl="http://music.163.com/song/media/outer/url?id=447925558.mp3"></audio-player> -->
    <audio-player
      ref="audio"
      fileurl="https://m8.music.126.net/20220904171214/17ceb9e137f23cae4c4213aa44b3f8e9/ymusic/2bab/cbdd/a0a0/8de94b05b87331de1375804d0f44d171.mp3"
    ></audio-player>
  </div>
</template>

<script>
import AudioPlayer from "./audioPlayer.vue";
export default {
  data() {
    return {};
  },
  components: {
    AudioPlayer,
  },
  mounted() {},
  methods: {
    handleChangeAudioVolume() {
      // 点击页面关闭音量键显示
      if (this.$refs.audio) this.$refs.audio.audioHuds = false;
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
