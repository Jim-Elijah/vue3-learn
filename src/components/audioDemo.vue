<template>
  <div class="page" @click="hideVolumeControls">
    <audio-player
      ref="audioPlayerRef"
      :src="audioSrc"
      :currentRef="currentRef"
      v-bind="{ ...progressRefNameMap }"
      :forwardStep="6"
      :backStep="3"
    >
      <template
        v-slot="{
          currentTime,
          duration,
          isPlaying,
          isMuted,
          onProgressBarClick,
          OnProgressMousedown,
          onVolumeBarClick,
          togglePlay,
          back,
          forward,
          noMusic,
        }"
      >
        <div class="audio-right">
          <div class="audio-time">
            <span class="audio-length-current">{{ currentTime }}</span>
          </div>
          <div
            class="progress-bar"
            :class="noMusic && 'disabled'"
            :ref="progressBarRefName"
            @click.stop="onProgressBarClick"
          >
            <div class="progress" :ref="progressRefName">
              <span class="circle" @mousedown="OnProgressMousedown"></span>
            </div>
          </div>
          <div class="audio-time">
            <span class="audio-length-total">{{ duration }}</span>
          </div>
          <div class="volume-wrapper" v-if="showVolume">
            <div
              @click.stop=""
              class="volume-progress-wrapper"
              v-show="showVolumeControls"
            >
              <div
                class="volume-bar"
                :ref="volumeBarRefName"
                @click="onVolumeBarClick"
              >
                <div class="volume" :ref="volumeRefName"></div>
              </div>
            </div>
            <i
              :class="[
                'iconfont',
                isMuted ? 'icon-mute' : 'icon-volume',
                noMusic && 'disabled',
              ]"
              @click.stop="toggleVolumeControls(noMusic)"
            >
            </i>
          </div>
        </div>
        <div class="operation-wrapper">
          <i
            :class="['iconfont', 'prev', currentTime === '00:00' && 'disabled']"
            @click="back"
          ></i>
          <i
            :class="[
              'iconfont',
              isPlaying ? ' icon-play' : 'icon-pause',
              noMusic && 'disabled',
            ]"
            @click="togglePlay"
          ></i>
          <i
            :class="[
              'iconfont',
              'next',
              (noMusic ||
                (currentTime === duration && currentTime !== '00:00')) &&
                'disabled',
            ]"
            @click="forward"
          ></i>
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
    const volumeBarRefName = "volumeBarRefName";
    const volumeRefName = "volumeRefName";
    return {
      showVolume: true,
      showVolumeControls: false,
      currentRef: {},
      progressBarRefName,
      progressRefName,
      volumeBarRefName,
      volumeRefName,
      progressRefNameMap: {
        progressBarRefName,
        progressRefName,
        volumeBarRefName,
        volumeRefName,
      },
      audioSrc:
        "https://m801.music.126.net/20220911225036/cc94f400ede4c51cb4c281e7524390f5/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096448125/9f26/c61d/8ec5/ff6818dec4d407643fad991f07a6660d.mp3",
    };
  },
  components: {
    AudioPlayer,
  },
  methods: {
    toggleVolumeControls(noMusic) {
      if (noMusic) return;
      this.showVolumeControls = !this.showVolumeControls;
    },
    hideVolumeControls() {
      this.showVolumeControls = false
    },
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

.volume-wrapper {
  position: relative;
  width: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-left: 6px;

  .volume-progress-wrapper {
    position: absolute;
    top: -140px;
    background: #f6f6f6;
    border-radius: 4px;
    padding: 10px;
  }

  .volume-bar {
    margin: 0 auto;
    width: 6px;
    height: 120px;
    background: #dcdcdc;
    border-radius: 100px;
    flex: 1;
    position: relative;
    transform: rotate(180deg);
    cursor: pointer;

    .volume {
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
  height: 14px;
  display: flex;
  padding: 0 15px;
  box-sizing: border-box;
  align-items: center;

  .progress-bar {
    background: #e4e4e4;
    border-radius: 60px;
    flex: 1;
    height: 5px;

    cursor: pointer;
    margin: 0 12px;
  }

  .progress {
    background-color: #6741ff;
    width: 0%;
    height: 100%;
    border-radius: 60px;
    position: relative;
  }

  .circle {
    position: absolute;
    right: -9px;
    top: -8px;
    width: 18px;
    height: 18px;
    background: #6741ff;
    border-radius: 50%;
  }

  .audio-time {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #2a1e5b;
  }
}

.iconfont {
  width: 30px;
  height: 100%;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center;
}

.operation-wrapper {
  width: 100%;
  height: 40px;
  margin-top: 37px;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-play {
    margin: 0 28px;
    background-image: url("../assets/play.png");
  }

  .icon-pause {
    margin: 0 28px;
    background-image: url("../assets/pause.png");
  }

  .prev {
    width: 22px;
    height: 17.5px;
    background-image: url("../assets/pre.png");
  }

  .next {
    width: 22px;
    height: 17.5px;
    background-image: url("../assets/next.png");
  }
}

.disabled {
  cursor: not-allowed !important;
}
</style>
