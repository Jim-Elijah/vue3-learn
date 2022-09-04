<template>
  <div class="audio-box">
    <audio @timeupdate="updateProgress" controls ref="audioRef" style="display: none">
      <source :src="fileurl" />
      您的浏览器不支持音频播放
    </audio>
    <div class="audio-right">
      <div class="audio-time" style="min-height: 10px">
        <span class="audio-length-current" id="audioCurTime">{{
          audioStart
        }}</span>
      </div>
      <div class="progress-bar-bg" ref="progressBarBgRef" @click="progeressBarClickHandler">
        <div class="progress-bar" ref="progressBarRef">
          <span class="circle"></span>
        </div>
      </div>
      <div class="audio-time" style="min-height: 10px">
        <span class="audio-length-total">{{ duration }}</span>
      </div>
      <div class="volume">
        <div @click.stop="" class="volume-progress" v-show="audioHuds">
          <div class="volume-bar-bg" ref="volumeBarBgRef" @click="volumeBarClickHandler">
            <div class="volume-bar" ref="volumeBarRef"></div>
          </div>
        </div>
        <i class="iconfont" :class="volumeIcon" @click.stop="audioHuds = !audioHuds">
        </i>
      </div>
    </div>
    <div class="operation-wrapper">
      <i class="iconfont prev" @click="back"></i>
      <i :class="[
          'iconfont',
          audioStatus === 'play' ? ' icon-play' : 'icon-pause',
        ]" @click="togglePlay"></i>
      <i class="iconfont next" @click="forward"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      fileurl: {
        trpe: String,
      },
    },
    data() {
      return {
        audioStatus: "pause",
        audioStart: "0:00",
        duration: "0:00",
        audioVolume: 0.5,
        audioHuds: false,
        muteThreshold: 0.08
      };
    },
    computed: {
      volumeIcon() {
        return this.audioVolume <= this.muteThreshold ? "icon-mute" : "icon-volume";
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      fetch() {
        let that = this;
        const progressBarRef = that.$refs.progressBarRef
        var myVid = this.$refs.audioRef;
        myVid.loop = false;
        // 监听音频播放完毕
        myVid.addEventListener(
          "ended",
          function () {
            that.audioStatus = "pause";
            progressBarRef.style.width = "0%"
          },
          false
        );
        if (myVid != null) {
          myVid.oncanplay = function () {
            that.duration = that.transTime(myVid.duration); // 计算音频时长
          };
          myVid.volume = 0.5; // 设置音量50%
        }
      },
      // 播放暂停控制
      togglePlay() {
        let recordAudio = this.$refs.audioRef; // 获取audio元素
        if (this.audioStatus === 'pause') {
          recordAudio.play();
          this.audioStatus = "play";
        } else {
          recordAudio.pause();
          this.audioStatus = "pause";
        }
      },
      // 回退
      back() {
        const audioRef = this.$refs.audioRef
        let currentTime = audioRef.currentTime - 3
        if (currentTime < 0) {
          currentTime = 0
        }
        audioRef.currentTime = currentTime
        this.audioStart = this.transTime(currentTime);
      },
      // 快进
      forward() {
        const audioRef = this.$refs.audioRef
        let currentTime = audioRef.currentTime + 3
        if (currentTime > audioRef.duration) {
          currentTime = audioRef.duration
        }
        audioRef.currentTime = currentTime
        this.audioStart = this.transTime(currentTime);
      },
      // 更新进度条与当前播放时间
      updateProgress(e) {
        var value = e.target.currentTime / e.target.duration;
        const progressBarRef = this.$refs.progressBarRef
        if (progressBarRef) {
          progressBarRef.style.width = value * 100 + "%";
          if (value === 1) {
            this.audioStatus = "pause";
          }
        } else {
          this.audioStatus = "pause";
        }
        console.log('update', this.$refs.audioRef.currentTime)
        this.audioStart = this.transTime(this.$refs.audioRef.currentTime);
      },
      /**
       * 音频播放时间换算
       * @param {number} value - 音频当前播放时间，单位秒
       */
      transTime(time) {
        var duration = parseInt(time);
        var minute = parseInt(duration / 60);
        var sec = (duration % 60) + "";
        var isM0 = ":";
        if (minute === 0) {
          minute = "00";
        } else if (minute < 10) {
          minute = "0" + minute;
        }
        if (sec.length === 1) {
          sec = "0" + sec;
        }
        return minute + isM0 + sec;
      },
      progeressBarClickHandler(e) {
        const progressBarBgRef = this.$refs.progressBarBgRef;
        const progressBarRef = this.$refs.progressBarRef;
        const audioRef = this.$refs.audioRef;

        const clientWidth = progressBarBgRef.clientWidth;
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        const ratio = e.offsetX / clientWidth
        const rate = ratio * 100

        // 设置进度条宽度
        progressBarRef.style.width = rate + "%";
        // 设置audio当前播放时刻
        audioRef.currentTime = audioRef.duration * ratio;
        // 设置播放时间
        this.audioStart = this.transTime(audioRef.currentTime);

      },
      volumeBarClickHandler(e) {
        const volumeBarBgRef = this.$refs.volumeBarBgRef;
        const volumeBarRef = this.$refs.volumeBarRef
        const audioRef = this.$refs.audioRef;

        const clientHeight = volumeBarBgRef.clientHeight;

        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        const ratio = e.offsetY / clientHeight;
        const rate = ratio * 100

        // ratio小于muteThreshold时静音
        const isMuted = ratio <= this.muteThreshold
        const audioVolume = isMuted ? 0 : ratio;
        // 设置音量进度条高度
        volumeBarRef.style.height = !isMuted ? rate + "%" : '0%';

        console.log('volume', isMuted, audioVolume)

        // 设置audio音量
        audioRef.volume = audioVolume;
        this.audioVolume = audioVolume
      },

    }
  }
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
      margin: 0 10px;
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
      right: -16px;
      top: -8px;
      width: 19px;
      height: 19px;
      background: #6741FF;
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
</style>