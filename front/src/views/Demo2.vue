<template>
  <div>
    <h2>Diferencia ingresos y gastos por departamento y destino</h2>
    <div class="viz-container">
      <div class="viz-top-axis">
        <span class="departments-legend">Departamentos</span>
        <span class="destinations-legend">Destinos</span>
      </div>
      <div id="viz"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3-5';

export default {
  data() {
    return {
      data: {},
      destinations: [],
      deptos: [],
    };
  },
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
    // Finds a department with the given name and returns
    // it's destinations as an object array
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
      // Calculate min/max values
      const allValues = [];
      Object.values(this.data).forEach((depto) => {
        Object.values(depto).forEach(({ value }) => allValues.push(value));
      });

      const max = d3.max(allValues);
      const min = d3.min(allValues);

      return d3.scaleDivergingSymlog(d3.interpolatePiYG).constant(10000000).domain([min, 0, max]);
    },
  },
  async mounted() {
    // Fetch data and transform it
    const vue = this;
    const data = await d3.json('grouped-differences.json');
    const destinations = this.getDestinations(data);
    const deptos = Object.keys(data);
    this.data = data;
    this.destinations = destinations;
    this.deptos = deptos;

    console.log(data);
    console.log(destinations);

    // Other constants
    const scale = this.createDivergentScale();
    const labelLengths = [];

    // Target div will be set the browsers width minus a small margin (80)
    const svg = d3.select('#viz')
      .append('svg')
      .attr('width', window.innerWidth - 80)
      .attr('height', 880);

    // Painting process:
    // -> Paint each department row
    // --> Paint destinations per each department

    const deptosSel = svg.selectAll('g')
      .data(deptos)
      .join('g')
      .attr('class', 'depto');

    // Append and translate each department group/label
    deptosSel
      .attr('transform', (d, i) => `translate(0,${(i + 1) * 24})`)
      .append('text')
      .text(d => d)
      .each(function resizeText() {
        labelLengths.push(this.getComputedTextLength());
        if (this.getComputedTextLength() > 140) {
          d3.select(this).attr('font-size', '10pt');
        }
        if (this.getComputedTextLength() > 180) {
          d3.select(this).attr('font-size', '8pt');
        }
      })
      .each(function alignRight() {
        const x = (d3.max(labelLengths) - this.getComputedTextLength()) - 240;
        d3.select(this).attr('x', x);
      });

    // For each department, append the differences
    deptosSel
      .each(function appendDiffrences(deptoStr) {
        const depto = vue.deptoToArray(deptoStr);
        d3.select(this)
          .append('g')
          .attr('class', 'difference')
          .attr('transform', `translate(${d3.max(labelLengths) - 240 + 16}, -12)`)
          .selectAll('rect')
          .data(depto)
          .join('rect')
          .attr('x', (d, i) => i * 14)
          .attr('height', 12)
          .attr('width', 14)
          .style('fill', d => scale(d.value))
          .text(d => d.dest);
      });
  },
};
</script>

<style scoped>
h2 {
  text-align: left;
  margin-left: 16px;
}

.viz-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.viz-top-axis {
  display: flex;
  flex-direction: row;
  color: black;
  font-weight: bold;
}

.departments-legend {
  width: 152px;
  text-align: right;
}

.destinations-legend {
  margin-left: 560px;
}
</style>
