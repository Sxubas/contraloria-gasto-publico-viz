<template>
  <div class="about">
    <iframe class="viz-iframe" :name="iframeName" src="https://contraloria-2c65d.firebaseapp.com" frameborder="0">
    </iframe>
  </div>
</template>

<script>
export default {
  computed: {
    iframeName() {
      return Date.now();
    },
  },
};
</script>

<style scoped>
.viz-iframe {
  width: 100%;
  height: calc(100vh - 120px);
}

.hex {
  height: 100px;
  width: calc(100px*1.732050807568877293);
  background: orange;
  transition: 3s linear;
  transform: rotate(-4000deg);
  position: relative;
  top: 50px;
  left: 70px;;
}

.hex::before {
  display: flex;
  content: "";
  height: 0;
  width: 0;
  border: calc(100px*1.732050807568877293/2.0) solid transparent;
  border-bottom: calc(100px/2) solid orange;
  border-top-width: 0;
  position: relative;
  top: calc(-50px);
}

.hex::after {
  display: flex;
  content: "";
  height: 0;
  width: 0;
  border: calc(100px*1.732050807568877293/2.0) solid transparent;
  border-top: calc(100px/2) solid orange;
  border-bottom-width: 0;
  position: relative;
  bottom: calc(-50px);
}

.svg {
  height: 400px;
  width: 400px;
  background: grey;
  position: relative;
  top: -100px;
}

.svg-hex-center {
  height: 100px;
  width: calc(100px*1.732050807568877293);
  background: orange;
  transition: 3s linear;
  transform: rotate(-4000deg);
  position: relative;
  top: 50px;
  left: 70px;;
}

.svg-hex-top {
  display: flex;
  content: "";
  height: 0;
  width: 0;
  border: calc(100px*1.732050807568877293/2.0) solid transparent;
  border-bottom: calc(100px/2) solid orange;
  border-top-width: 0;
  position: relative;
  top: calc(-50px);
}

.svg-hex-bottom {
  display: flex;
  content: "";
  height: 0;
  width: 0;
  border: calc(100px*1.732050807568877293/2.0) solid transparent;
  border-top: calc(100px/2) solid orange;
  border-bottom-width: 0;
  position: relative;
  bottom: calc(-50px);
}

</style>
