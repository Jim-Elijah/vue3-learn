<template>
  <div class="lottie-demo-wrapper">
    <button @click="isShow = true">show lottie</button>
    <div class="lottie-wrapper" v-show="isShow">
      <div class="lottie" ref="lottieRef"></div>
    </div>
  </div>
</template>
<script>
import lottie from "lottie-web";

export default {
  name: "lottie-demo",
  data() {
    return {
      isShow: false,
      lottieAni: null,
    };
  },
  watch: {
    isShow(val) {
      console.log("w", val);
      if (val) {
        if (!this.lottieAni) {
          const successJson = require("../../assets/lottie/success.json");
          console.log("successJson", successJson);
          this.lottieAni = lottie.loadAnimation({
            container: this.$refs.lottieRef,
            renderer: "svg",
            autoplay: false,
            animationData: successJson,
          });
        }
        this.lottieAni.play();
        setTimeout(() => {
          this.lottieAni.pause();
          this.isShow = false;
        }, 1500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.lottie {
  width: 300px;
  height: 300px;
}
</style>