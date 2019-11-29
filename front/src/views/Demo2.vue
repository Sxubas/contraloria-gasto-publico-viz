<template>
  <div>
    <h1>Diferencia ingresos y gastos por departamento</h1>
    <div id="viz"></div>
  </div>
</template>

<script>
import * as d3 from 'd3-5';

export default {
  async mounted() {
    const json = await d3.json('grouped-differences.json');
    console.log(json);
    console.log(d3);
  },
};
</script>

<style scoped>

</style>
