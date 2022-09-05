<template>
  <div class="audio-box">
    <audio
      @canplay="updateDuration"
      @ended="endedHandler"
      @timeupdate="updateTime"
      controls
      ref="audioRef"
      style="display: none"
    >
      <source :src="src" />
      您的浏览器不支持音频播放
    </audio>
    <slot
      :currentTime="currentTime"
      :duration="duration"
      :isPlaying="isPlaying"
      :isMuted="isMuted"
      :progeressBarClickHandler="progeressBarClickHandler"
      :mousedownHandler="mousedownHandler"
      :volumeBarClickHandler="volumeBarClickHandler"
      :togglePlay="togglePlay"
      :back="back"
      :forward="forward"
    >
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default:
        "https://img-qn.51miz.com/Audio/2017/02/06/08/20170206081849_A100187_34f7e6b8-thumb.mp3",
    },
    forwardStep: {
      type: Number,
      default: 3,
    },
    backStep: {
      type: Number,
      default: 3,
    },
    // 静音门限
    muteThreshold: {
      type: Number,
      default: 0.08,
    },
  },
  data() {
    return {
      // 播放状态
      isPlaying: false,
      currentTime: "00:00",
      duration: "00:00",
      // 音量
      audioVolume: 0.5,
      //是否在拖动进度条
      isMoving: false,
      // 拖动进度条时保存播放状态
      savedIsPlaying: false,
    };
  },
  computed: {
    isMuted() {
      return this.audioVolume < this.muteThreshold;
    },
    audioRef() {
      const vm = this.$parent.$refs.audio;
      return vm.$refs.audioRef;
    },
    progressBarBgRef() {
      const tmp = this.$parent.$refs.progressBarBgRef;
      return tmp;
    },
    progressBarRef() {
      const tmp = this.$parent.$refs.progressBarRef;
      return tmp;
    },
    volumeBarBgRef() {
      const tmp = this.$parent.$refs.volumeBarBgRef;
      return tmp;
    },
    volumeBarRef() {
      const tmp = this.$parent.$refs.volumeBarRef;
      return tmp;
    },
  },
  methods: {
    updateDuration() {
      const audioRef = this.audioRef;
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
      const audioRef = this.audioRef;
      if (this.currentTime === this.duration) {
        this.currentTime = "00:00";
        audioRef.currentTime = 0;
        this.progressBarRef.style.width = "0%";
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
      const audioRef = this.audioRef;
      let currentTime = audioRef.currentTime - this.backStep;
      if (currentTime < 0) {
        currentTime = 0;
      }
      audioRef.currentTime = currentTime;
      this.currentTime = this.transTime(currentTime);
    },
    // 快进
    forward() {
      const audioRef = this.audioRef;
      let currentTime = audioRef.currentTime + this.forwardStep;
      if (currentTime > audioRef.duration) {
        currentTime = audioRef.duration - 0.01;
      }
      audioRef.currentTime = currentTime;
      this.currentTime = this.transTime(currentTime);
    },
    // 更新进度条与当前播放时间
    updateTime() {
      const audioRef = this.audioRef;
      const value = audioRef.currentTime / audioRef.duration;
      const progressBarRef = this.progressBarRef;
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
      const progressBarBgRef = this.progressBarBgRef;
      const progressBarRef = this.progressBarRef;
      const audioRef = this.audioRef;

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
      const volumeBarBgRef = this.volumeBarBgRef;
      const volumeBarRef = this.volumeBarRef;
      const audioRef = this.audioRef;

      const clientHeight = volumeBarBgRef.clientHeight;

      // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      const ratio = e.offsetY / clientHeight;
      const rate = ratio * 100;

      // ratio小于muteThreshold时静音
      const isMuted = ratio < this.muteThreshold;
      const audioVolume = isMuted ? 0 : ratio;
      // 设置音量进度条高度
      volumeBarRef.style.height = !isMuted ? rate + "%" : "0%";
      // 设置audio音量
      audioRef.volume = audioVolume;
      this.audioVolume = audioVolume;
    },
    mousedownHandler() {
      // 拖动前保存播放状态
      this.savedIsPlaying = this.isPlaying;
      this.audioRef.pause();
      this.isPlaying = false;
      this.isMoving = true;

      const progressBarBgRef = this.progressBarBgRef;
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
          setTimeout(() => {
            this.isMoving = false;
            if (this.savedIsPlaying) {
              this.audioRef.play();
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

<style lang="scss" scoped></style>
