<template>
  <div class="carousel-wrapper">
    <div class="carousel">
      <div class="img-wrapper">
        <img
          :src="item.url"
          alt="无法展示"
          v-for="item in testList"
          :key="item.url"
          class="img"
        />
      </div>
      <div class="img-wrapper">
        <img
          :src="item.url"
          alt="无法展示"
          v-for="item in testList"
          :key="item.url"
          class="img"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "carousel-demo",
  data() {
    return {
      carouselList: [
        {
          url: require("@/assets/img/client_scroll_1@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_2@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_3@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_4@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_5@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_6@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_7@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_8@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_9@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_10@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_11@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_12@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_13@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_14@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_15@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_16@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_17@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_18@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_19@2x.png"),
        },
        {
          url: require("@/assets/img/client_scroll_20@2x.png"),
        },
      ],
    };
  },
  computed: {
    testList() {
      return this.carouselList.slice(0, 10);
    },
  },
};
</script>
<style lang="scss" scoped>
.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 168px;
  margin-top: 60px;
  .carousel {
    display: flex;
    width: 6000px;
    height: 100%;
    padding-bottom: 20px;
    position: absolute;
    box-sizing: border-box;
    border-style: none;
    .img-wrapper {
      animation-name: banner-logo-scroll;
      animation-duration: 6s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .img {
      margin: 0 0 20px 20px;
      width: 205px;
      box-sizing: border-box;
      height: 100%;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.07);
      border-radius: 10px;
    }
  }
  .img-wrapper:hover {
    cursor: pointer;
    animation-play-state: paused;
  }
}
@keyframes banner-logo-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>