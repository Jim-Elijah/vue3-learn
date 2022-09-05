<template>
  <div class="audio-box">
    <audio @canplay="updateDuration" @ended="endedHandler" @timeupdate="updateTime" controls ref="audioRef"
      style="display: none">
      <source :src="src" />
      您的浏览器不支持音频播放
    </audio>
    <div class="audio-right">
      <div class="audio-time" style="min-height: 10px">
        <span class="audio-length-current" id="audioCurTime">{{
          currentTime
        }}</span>
      </div>
      <div class="progress-bar-bg" ref="progressBarBgRef" @click.stop="progeressBarClickHandler">
        <div class="progress-bar" ref="progressBarRef">
          <span class="circle" ref="circle" @mousedown="mousedownHandler"></span>
        </div>
      </div>
      <div class="audio-time" style="min-height: 10px">
        <span class="audio-length-total">{{ duration }}</span>
      </div>
      <div class="volume" v-if="showVolume">
        <div @click.stop="" class="volume-progress" v-show="audioHuds">
          <div class="volume-bar-bg" ref="volumeBarBgRef" @click.stop="volumeBarClickHandler">
            <div class="volume-bar" ref="volumeBarRef"></div>
          </div>
        </div>
        <i class="iconfont" :class="volumeIcon" @click.stop="audioHuds = !audioHuds">
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
  </div>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        default: "https://img-qn.51miz.com/Audio/2017/02/06/08/20170206081849_A100187_34f7e6b8-thumb.mp3",
      },
      showVolume: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // 播放状态
        isPlaying: false,
        currentTime: "00:00",
        duration: "00:00",
        // 音量controls
        audioHuds: false,
        // 音量
        audioVolume: 0.5,
        // 静音门限
        muteThreshold: 0.08,
        //是否在拖动进度条
        isMoving: false,
        // 拖动进度条时保存播放状态
        savedIsPlaying: false,
      };
    },
    computed: {
      volumeIcon() {
        return this.audioVolume <= this.muteThreshold ?
          "icon-mute" :
          "icon-volume";
      },
    },
    methods: {
      updateDuration() {
        const audioRef = this.$refs.audioRef;
        this.duration = this.transTime(audioRef.duration);
        audioRef.loop = false;
        audioRef.volume = 0.5; // 设置音量50%
        this.audioVolume = 0.5;
      },
      endedHandler() {
        this.isPlaying = false;
      },
      // 播放暂停控制
      togglePlay() {
        const audioRef = this.$refs.audioRef; // 获取audio元素
        if (this.currentTime === this.duration) {
          console.log("reset");
          this.currentTime = "00:00";
          audioRef.currentTime = 0;
          this.$refs.progressBarRef.style.width = "0%";
        }
        if (!this.isPlaying) {
          audioRef.play();
          this.isPlaying = true;
        } else {
          audioRef.pause();
          this.isPlaying = false;
        }
      },
      // 回退
      back() {
        const audioRef = this.$refs.audioRef;
        let currentTime = audioRef.currentTime - 3;
        if (currentTime < 0) {
          currentTime = 0;
        }
        audioRef.currentTime = currentTime;
        this.currentTime = this.transTime(currentTime);
      },
      // 快进
      forward() {
        const audioRef = this.$refs.audioRef;
        let currentTime = audioRef.currentTime + 3;
        if (currentTime > audioRef.duration) {
          currentTime = audioRef.duration - 0.01;
        }
        audioRef.currentTime = currentTime;
        this.currentTime = this.transTime(currentTime);
      },
      // 更新进度条与当前播放时间
      updateTime() {
        const audioRef = this.$refs.audioRef;
        var value = audioRef.currentTime / audioRef.duration;
        const progressBarRef = this.$refs.progressBarRef;
        if (progressBarRef) {
          progressBarRef.style.width = value * 100 + "%";
          if (value === 1) {
            this.isPlaying = false;
          }
        } else {
          this.isPlaying = false;
        }
        this.currentTime = this.transTime(audioRef.currentTime);
      },
      // 音频播放时间换算, 秒转为字符串, eg: 70 => 01:10
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
      updateProgress(offsetX) {
        const progressBarBgRef = this.$refs.progressBarBgRef;
        const progressBarRef = this.$refs.progressBarRef;
        const audioRef = this.$refs.audioRef;

        const clientWidth = progressBarBgRef.clientWidth;
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        const ratio = offsetX / clientWidth;
        const rate = ratio * 100;

        // 设置进度条宽度
        progressBarRef.style.width = rate + "%";
        // 设置audio当前播放时刻
        audioRef.currentTime = audioRef.duration * ratio;
        // 设置播放时间
        this.currentTime = this.transTime(audioRef.currentTime);
      },
      progeressBarClickHandler(e) {
        if (!this.isMoving || this.isPlaying) {
          this.updateProgress(e.offsetX);
        }
      },
      volumeBarClickHandler(e) {
        const volumeBarBgRef = this.$refs.volumeBarBgRef;
        const volumeBarRef = this.$refs.volumeBarRef;
        const audioRef = this.$refs.audioRef;

        const clientHeight = volumeBarBgRef.clientHeight;

        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        const ratio = e.offsetY / clientHeight;
        const rate = ratio * 100;

        // ratio小于muteThreshold时静音
        const isMuted = ratio <= this.muteThreshold;
        const audioVolume = isMuted ? 0 : ratio;
        // 设置音量进度条高度
        volumeBarRef.style.height = !isMuted ? rate + "%" : "0%";

        console.log("volume", isMuted, audioVolume);

        // 设置audio音量
        audioRef.volume = audioVolume;
        this.audioVolume = audioVolume;
      },
      mousedownHandler() {
        // 拖动前保存播放状态
        this.savedIsPlaying = this.isPlaying;
        this.$refs.audioRef.pause();
        this.isPlaying = false;
        this.isMoving = true;

        let progressBarBgRef = this.$refs.progressBarBgRef;
        //进度条 左 边距离页面左边的距离 移动最小值
        let moveMin =
          progressBarBgRef.offsetParent.offsetLeft + progressBarBgRef.offsetLeft;
        //进度条 右 边距离页面左边的距离 移动最大值
        let moveMax =
          progressBarBgRef.offsetParent.offsetLeft +
          progressBarBgRef.offsetLeft +
          progressBarBgRef.clientWidth;

        let move = (move) => {
          if (move.pageX >= moveMax) {
            return;
          } else if (move.pageX <= moveMin) {
            return;
          }
          this.updateProgress(move.pageX - moveMin);
        };
        //获取当前鼠标的位置
        document.addEventListener("mousemove", move, false);
        //鼠标弹起来
        document.addEventListener(
          "mouseup",
          () => {
            console.log("mouseup");
            setTimeout(() => {
              this.isMoving = false;
              if (this.savedIsPlaying) {
                this.$refs.audioRef.play();
                this.isPlaying = this.savedIsPlaying;
                this.savedIsPlaying = !this.savedIsPlaying;
              }
            }, 200);
            document.removeEventListener("mousemove", move, false);
          },
          false
        );
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