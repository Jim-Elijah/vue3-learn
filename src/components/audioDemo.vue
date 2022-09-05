<template>
  <div class="page" @click="handleChangeAudioVolume">
    <audio-player ref="audio" :forwardStep="6" :backStep="3">
      <template v-slot="{
          currentTime,
          duration,
          isPlaying,
          isMuted,
          progeressBarClickHandler,
          mousedownHandler,
          volumeBarClickHandler,
          togglePlay,
          back,
          forward,
        }">
        <div class="audio-right">
          <div class="audio-time">
            <span class="audio-length-current">{{ currentTime }}</span>
          </div>
          <div class="progress-bar-bg" ref="progressBarBgRef" @click.stop="progeressBarClickHandler">
            <div class="progress-bar" ref="progressBarRef">
              <span class="circle" @mousedown="mousedownHandler"></span>
            </div>
          </div>
          <div class="audio-time">
            <span class="audio-length-total">{{ duration }}</span>
          </div>
          <div class="volume" v-if="showVolume">
            <div @click.stop="" class="volume-progress" v-show="showVolumeControls">
              <div class="volume-bar-bg" ref="volumeBarBgRef" @click.stop="volumeBarClickHandler">
                <div class="volume-bar" ref="volumeBarRef"></div>
              </div>
            </div>
            <i :class="['iconfont', isMuted ? 'icon-mute' : 'icon-volume']" @click.stop="toggleVolumeControls">
            </i>
          </div>
        </div>
        <div class="operation-wrapper" @click.stop="">
          <i :class="['iconfont', 'prev', currentTime === '00:00' && 'disabled']" @click="back"></i>
          <i :class="['iconfont', isPlaying ? ' icon-play' : 'icon-pause']" @click="togglePlay"></i>
          <i :class="[
              'iconfont',
              'next',
              currentTime === duration && currentTime !== '00:00' && 'disabled',
            ]" @click="forward"></i>
        </div>
      </template>
    </audio-player>
  </div>
</template>

<script>
  import AudioPlayer from "./audioPlayer.vue";
  export default {
    data() {
      return {
        showVolume: false,
        showVolumeControls: false,
      };
    },
    components: {
      AudioPlayer,
    },
    methods: {
      toggleVolumeControls() {
        this.showVolumeControls = !this.showVolumeControls;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .audio-box {
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
    height: 14px;
    display: flex;
    padding: 0 15px;
    box-sizing: border-box;
    align-items: center;

    .progress-bar-bg {
      background: #e4e4e4;
      border-radius: 60px;
      flex: 1;
      height: 5px;

      cursor: pointer;
      margin: 0 12px;
    }

    .progress-bar {
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

    .disabled {
      cursor: not-allowed;
    }
  }
</style>