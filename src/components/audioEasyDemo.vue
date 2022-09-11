<template>
  <div class="page">
    <audio-player
      ref="audioPlayerRef"
      :src="audioSrc"
      :currentRef="currentRef"
      v-bind="{ ...progressRefNameMap }"
    >
      <template
        v-slot="{
          currentTime,
          duration,
          isPlaying,
          onProgressBarClick,
          togglePlay,
          noMusic,
        }"
      >
        <div class="audio-right">
          <div class="operation-wrapper" @click.stop="">
            <i
              :class="[
                'iconfont',
                isPlaying ? ' icon-play' : 'icon-pause',
                noMusic && 'disabled',
              ]"
              @click="togglePlay"
            ></i>
          </div>
          <div
            class="progress-bar"
            :class="noMusic && 'disabled'"
            :ref="progressBarRefName"
            @click.stop="onProgressBarClick"
          >
            <div class="progress" :ref="progressRefName"></div>
          </div>
          <div class="audio-time">
            <span class="audio-length-current">{{ currentTime }}</span
            >/<span class="audio-length-total">{{ duration }}</span>
          </div>
        </div>
      </template>
    </audio-player>
  </div>
</template>

<script>
import AudioPlayer from "./audioPlayer.vue";
export default {
  data() {
    const progressBarRefName = "progressBarRef";
    const progressRefName = "progressRef";
    return {
      currentRef: {},
      progressBarRefName,
      progressRefName,
      progressRefNameMap: {
        progressBarRefName,
        progressRefName,
      },
      audioSrc:
        "https://m801.music.126.net/20220911225036/cc94f400ede4c51cb4c281e7524390f5/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096448125/9f26/c61d/8ec5/ff6818dec4d407643fad991f07a6660d.mp3",
    };
  },
  components: {
    AudioPlayer,
  },
  mounted() {
    const { audioPlayerRef } = this.$refs;
    this.currentRef = audioPlayerRef || {};
  },
};
</script>
<style lang="scss" scoped>
.audio-player-box {
  padding-top: 150px;
  display: flex;
  flex-direction: column;
}

.volume {
  position: relative;
  width: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-left: 6px;

  .volume-progress {
    position: absolute;
    top: -140px;
    background: #f6f6f6;
    border-radius: 4px;
    padding: 10px;
  }

  .volume-bar-bg {
    margin: 0 auto;
    width: 6px;
    height: 120px;
    background: #dcdcdc;
    border-radius: 100px;
    flex: 1;
    position: relative;
    transform: rotate(180deg);
    cursor: pointer;

    .volume-bar {
      width: 6px;
      height: 50%;
      background: #56bf8b;
      border-radius: 100px;
    }
  }

  .icon-volume {
    background-image: url("../assets/volume.png");
  }

  .icon-mute {
    background-image: url("../assets/mute.png");
  }
}

.audio-right {
  width: 100%;
  background: rgba(103, 65, 255, 0.1);
  border-radius: 4px;
  height: 28px;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: center;

  .progress-bar {
    background-color: rgba(103, 65, 255, 0.2);
    border-radius: 40px;
    flex: 1;
    height: 3px;

    cursor: pointer;
    margin: 0 9px;
  }

  .progress {
    background-color: #6741ff;
    width: 0%;
    height: 100%;
    border-radius: 60px;
    position: relative;
  }

  .audio-time {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #6741ff;
  }
}

.iconfont {
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center;
}

.operation-wrapper {
  width: 10.5px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-play {
    background-image: url("../assets/play.png");
  }

  .icon-pause {
    background-image: url("../assets/pause.png");
  }

  .disabled {
    cursor: not-allowed;
  }
}
</style>