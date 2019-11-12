<template>
  <div class="about">
    <p>
      Este es un proyecto de código abierto que utiliza los datos de la
      contraloría para visualizar el ingreso y el gasto público.
      Utilizamos los datos de 2018 de ingresos y gastos, disponibles en:
    </p>
    <br>
    <br>
    <div class="hex"></div>

    <svg class="svg">
      <g>
        <rect x=50 y=50 class="svg-hex-top"></rect>
        <rect x=50 y=50 class="svg-hex-center"></rect>
        <rect x=50 y=50 class="svg-hex-bottom"></rect>
      </g>
    </svg>
  </div>
</template>

<style scoped>
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
