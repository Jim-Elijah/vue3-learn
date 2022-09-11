<template>
  <div class="audio-player-box">
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
      :noMusic="noMusic"
      :onProgressBarClick="progressBarClickHandler"
      :OnProgressMousedown="progressMousedownHandler"
      :onVolumeBarClick="volumeBarClickHandler"
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
      default: "",
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
    currentRef: {
      type: Object,
      default: () => ({}),
    },
    progressBarRefName: {
      type: String,
      default: 'progressBarRef',
    },
    progressRefName: {
      type: String,
      default: 'progressRef',
    },
    volumeBarRefName: {
      type: String,
      default: 'volumeBarRef',
    },
    volumeRefName: {
      type: String,
      default: 'volumeRef',
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
      const { audioRef = {} } = this.currentRef.$refs || {}
      return audioRef
    },
    noMusic() {
      return this.duration === '00:00'
    },
    progressBarRef() {
      return this.$parent.$refs[this.progressBarRefName] || {};
    },
    progressRef() {
      return this.$parent.$refs[this.progressRefName] || {};
    },
    volumeBarRef() {
      return this.$parent.$refs[this.volumeBarRefName] || {};
    },
    volumeRef() {
      return this.$parent.$refs[this.volumeRefName] || {};
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
      if (this.noMusic) {
        return
      }
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
      if (this.noMusic) return
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
      if (this.noMusic) return
      const audioRef = this.audioRef;
      let currentTime = audioRef.currentTime + this.forwardStep;
      if (currentTime > audioRef.duration) {
        currentTime = audioRef.duration;
      }
      audioRef.currentTime = currentTime;
      this.currentTime = this.transTime(currentTime);
    },
    // 更新进度条与当前播放时间
    updateTime() {
      const audioRef = this.audioRef;
      const value = audioRef.currentTime / audioRef.duration;
      const progressRef = this.progressRef;
      if (progressRef) {
        progressRef.style.width = value * 100 + "%";
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
      const progressBarRef = this.progressBarRef;
      const progressRef = this.progressRef;
      const audioRef = this.audioRef;

      const clientWidth = progressBarRef.clientWidth;
      // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      const ratio = offsetX / clientWidth;
      const rate = ratio * 100;

      // 设置进度条宽度
      progressRef.style.width = rate + "%";
      // 设置audio当前播放时刻
      audioRef.currentTime = audioRef.duration * ratio;
      // 设置播放时间
      this.currentTime = this.transTime(audioRef.currentTime);
    },
    progressBarClickHandler(e) {
      if (this.noMusic) return
      if (!this.isMoving || this.isPlaying) {
        this.updateProgress(e.offsetX);
      }
    },
    volumeBarClickHandler(e) {
      if (this.noMusic) return
      const volumeBarRef = this.volumeBarRef;
      const volumeRef = this.volumeRef;
      const audioRef = this.audioRef;

      const clientHeight = volumeBarRef.clientHeight;

      // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      const ratio = e.offsetY / clientHeight;
      const rate = ratio * 100;

      // ratio小于muteThreshold时静音
      const isMuted = ratio < this.muteThreshold;
      const audioVolume = isMuted ? 0 : ratio;
      // 设置音量进度条高度
      volumeRef.style.height = !isMuted ? rate + "%" : "0%";
      // 设置audio音量
      audioRef.volume = audioVolume;
      this.audioVolume = audioVolume;
    },
    progressMousedownHandler() {
      if (this.noMusic) return
      // 拖动前保存播放状态
      this.savedIsPlaying = this.isPlaying;
      this.audioRef.pause();
      this.isPlaying = false;
      this.isMoving = true;

      const progressBarRef = this.progressBarRef;
      //进度条 左 边距离页面左边的距离 移动最小值
      let moveMin =
        progressBarRef.offsetParent.offsetLeft + progressBarRef.offsetLeft;
      //进度条 右 边距离页面左边的距离 移动最大值
      let moveMax =
        progressBarRef.offsetParent.offsetLeft +
        progressBarRef.offsetLeft +
        progressBarRef.clientWidth;

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