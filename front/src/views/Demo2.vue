<template>
  <div>
    <h1>Diferencia ingresos y gastos por departamento</h1>
    <div id="viz"></div>
  </div>
</template>

<script>
import * as d3 from 'd3-5';

export default {
  methods: {
    getDestinations(data) {
      const destinations = {};

      Object.keys(data).forEach((depto) => {
        Object.keys(data[depto]).forEach((dest) => {
          destinations[dest] = true;
        });
      });

      return Object.keys(destinations);
    },
    deptoToArray(deptoString) {
      const depto = this.data[deptoString];
      const array = [];

      this.destinations.forEach((dest) => {
        // Add empty values as 0
        if (!depto[dest]) {
          depto[dest] = { value: 0 };
        }
      });

      Object.keys(depto).forEach((dest) => {
        array.push({
          dest,
          ...depto[dest],
        });
      });

      return array;
    },
    createDivergentScale() {
      return d3.scaleSequential(d3.interpolatePiYG);
    },
  },
  async mounted() {
    const vue = this;
    const data = await d3.json('grouped-differences.json');
    const destinations = this.getDestinations(data);
    const deptos = Object.keys(data);
    this.data = data;
    this.destinations = destinations;
    this.deptos = deptos;

    console.log(data);
    console.log(destinations);

    const scale = this.createDivergentScale();

    console.log(scale(-100), scale(0), scale(1));


    const svg = d3.select('#viz')
      .append('svg')
      .attr('width', window.innerWidth - 80)
      .attr('height', 880);

    const deptosSel = svg.selectAll('g')
      .data(deptos)
      .join('g')
      .attr('class', 'depto');

    const lengths = [];
    // Append deptos name
    deptosSel
      .attr('transform', (d, i) => `translate(0,${(i + 1) * 24})`)
      .append('text')
      .text(d => d)
      .each(function appendLenghts() {
        lengths.push(this.getComputedTextLength());
        if (this.getComputedTextLength() > 140) {
          d3.select(this).attr('font-size', '10pt');
        }
      })
      .each(function rePlace() {
        const x = (d3.max(lengths) - this.getComputedTextLength()) - 240;
        d3.select(this).attr('x', x);
      });

    deptosSel
      .each(function appendDiffrences(deptoStr) {
        const depto = vue.deptoToArray(deptoStr);
        d3.select(this)
          .append('g')
          .attr('class', 'difference')
          .attr('transform', `translate(${d3.max(lengths) - 240 + 16}, -12)`)
          .selectAll('rect')
          .data(depto)
          .join('rect')
          .attr('x', (d, i) => i * 16)
          .attr('height', 12)
          .attr('width', 16)
          .style('fill', 'firebrick')
          .text(d => d.dest);
      });
  },
};
</script>

<style scoped>
svg text {
  text-align: right;
}
</style>
