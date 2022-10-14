<template>
  <div class="logosOutBox">
    <div class="imgOutBox">
      <img
        alt="img"
        class="logosImg"
        src="../../assets/img/clients@2x.png"
      />
      <img
        alt="img"
        class="logosImg"
        src="../../assets/img/clients@2x.png"
      />
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@keyframes banner-logo-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
.logosOutBox {
  width: 100%;
  height: 92px;
  padding-top: 100px;
  display: inline-block;
  position: relative;
  overflow: hidden;
}
.logosOutBox .imgOutBox {
  display: block;
  width: 5500px;
  height: 92px;
  position: absolute;
  box-sizing: border-box;
}
.logosOutBox .logosImg {
  width: auto;
  height: 92px;
  max-width: none;
  display: inline-block;
  vertical-align: middle;
  border-style: none;
  animation-name: banner-logo-scroll;
  /* animation-duration: 80s; */
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>