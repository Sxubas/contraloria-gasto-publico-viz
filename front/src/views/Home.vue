<template>
  <div class="home-container">
    <div class="cards-container">
      <div class="viz-card" @click="$router.push('/diferencias')">
        <h2>Diferencias ingresos y gastos</h2>
        <img
          class="viz-card-image"
          src="@/assets/diferencias-preview.png"
          alt="visualizaciòn ingresos y gastos"
        >
        <div class="text">
          Ver la diferencia entre ingresos y gastos por municipio / departamento,
          discriminado por cada destino.
        </div>
      </div>
      <div class="viz-card" @click="$router.push('/inconsistencias')">
        <h2>Inconsistencias en distribución</h2>
        <img
          class="viz-card-image"
          src="@/assets/inconsistencias-preview.png"
          alt="visualizaciòn ingresos y gastos"
        >
        <div class="text">
          Ver la cantidad de inconsistencias en
          la distribución del ingreso y gasto público, por municipio y departamento.
        </div>
      </div>
      <div class="viz-card" @click="$router.push('/relacion-ingreso-gasto')">
        <h2>Relación ingresos vs gastos</h2>
        <img
          class="viz-card-image"
          src="@/assets/relacion-ingresos-gastos.jpeg"
          alt="visualizaciòn ingresos y gastos"
        >
        <div class="text">
          Ver cada departamento y su relación ingreso/gasto para identificar
          como se comporta respecto a otros territorios.
        </div>
      </div>
    </div>
    <div class="icons-container">
      Seleccione una visualización para interactuar con ella
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.cards-container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
}

.viz-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid gray;
  width: 400px;
  cursor: pointer;
  background-color: transparent;
  box-shadow: 2px 2px 4px 1px rgb(95, 95, 95);
  transition: 0.32s all ease-in;
  margin: 0 8px;
}

.viz-card:hover {
  background-color: rgb(226, 226, 226);
  border-color: rgb(156, 156, 156);
}

.viz-card-image {
  width: 100%;
  height: 224px;
  border: 1px solid gray;
  margin: 4px 0;
  transition: 0.32s all ease-in;
}

.viz-card:hover .viz-card-image {
  filter: saturate(0.48);
}

.viz-card .text {
  font-size: 1.24rem;
  margin: 4px;
}

.icons-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
}

.icons-container img {
  height: 64px;
  margin: 8px;
}
</style>
