<template>
  <div>
    <h2>Diferencia ingresos y gastos por departamento y destino</h2>
    <div class="controls-container">
      <select v-model="deptosSortingMethod">
        <option value="alphabetical">Orden alfabético</option>
        <option value="most-greens-first">Los que tengan más verdes primero</option>
        <option value="most-reds-first">Los que tengan más rojos primero</option>
      </select>
    </div>
    <div class="viz-container">
      <div class="viz-top-axis">
        <span class="departments-legend">Departamentos</span>
        <span class="destinations-legend">Destinos</span>
      </div>
      <div id="viz">
        <svg></svg>
      </div>
      <div
        class="difference-hover-tooltip"
        v-if="showTooltip"
        :style="{top: `${tooltipY}px`, left: `${tooltipX}px`, backgroundColor: tooltipDepto.color}"
      >
        {{tooltipDepto.dest}}<br>
        {{tooltipDepto.depto}}<br>
        {{tooltipDepto.value}}
      </div>
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
      fetchedData: false,
      showTooltip: false,
      tooltipDepto: undefined,
      tooltipX: -1,
      tooltipY: -1,
      deptosSortingMethod: 'alphabetical',
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
    getDeptos(data) {
      const deptosNames = Object.keys(data);
      const deptos = deptosNames.map((name) => {
        let positives = 0;
        let negatives = 0;
        Object.values(data[name]).forEach(({ value }) => {
          if (value > 0) positives += 1;
          if (value < 0) negatives += 1;
        });

        return {
          name,
          positives,
          negatives,
        };
      });

      return deptos;
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
          depto: deptoString,
        });
      });

      array.sort((a, b) => a.dest.localeCompare(b.dest));

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
    renderTooltip(target, depto, color) {
      const { x, y } = target.getBoundingClientRect();
      this.tooltipX = x + 12 + 16;
      this.tooltipY = y + window.scrollY + 0 + 16;

      this.tooltipDepto = { ...depto, color };
      this.showTooltip = true;
    },
    hideTooltip() {
      this.showTooltip = false;
      this.tooltipX = -10;
      this.tooltipY = -10;
    },
    sortDeptos(deptos) {
      if (this.deptosSortingMethod === 'alphabetical') {
        deptos.sort((a, b) => a.name.localeCompare(b.name));
        // eslint-disable-next-line no-param-reassign
        deptos.forEach((depto, i) => { depto.order = i; });
      } else if (this.deptosSortingMethod === 'most-greens-first') {
        deptos.sort((a, b) => b.positives - a.positives);
        // eslint-disable-next-line no-param-reassign
        deptos.forEach((depto, i) => { depto.order = i; });
      } else if (this.deptosSortingMethod === 'most-reds-first') {
        deptos.sort((a, b) => b.negatives - a.negatives);
        // eslint-disable-next-line no-param-reassign
        deptos.forEach((depto, i) => { depto.order = i; });
      }

      deptos.sort((a, b) => a.name.localeCompare(b.name));
    },
    async renderViz() {
      // Fetch data and transform it if it hasn't been initialized
      if (!this.fetchedData) {
        const data = await d3.json('grouped-differences.json');
        const destinations = this.getDestinations(data);
        const deptos = this.getDeptos(data);
        this.destinations = destinations;
        this.deptos = deptos;
        this.data = data;
        this.fetchedData = true;
      }

      const { data, destinations, deptos } = this;
      const vue = this;

      this.sortDeptos(deptos);

      console.log(data);
      console.log(deptos);
      console.log(destinations);

      // Other constants
      const scale = this.createDivergentScale();
      const labelLengths = [];

      // Target div -> svg will be set the browsers width minus a small margin (80)
      const svg = d3.select('#viz svg')
        .attr('width', window.innerWidth - 80)
        .attr('height', 880);

      // Resize svg on window resize
      window.onresize = () => {
        d3.select('#viz svg')
          .attr('width', window.innerWidth - 80);
      };

      // Painting process:
      // -> Paint each department row
      // --> Paint destinations per each department

      svg.selectAll('g.depto')
        .data(deptos)
        .join(
          // This will be run only once, the first time
          (enter) => {
            // Add a group per each department
            const deptosSel = enter.append('g').attr('class', 'depto');

            // Append and translate each department group/label
            deptosSel.attr('transform', (d, i) => `translate(0,${(i + 1) * 24})`)
              .append('text')
              .text(d => d.name)
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
            deptosSel.each(function appendDiffrences({ name }) {
              const depto = vue.deptoToArray(name);
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
                .text(d => d.dest)
                .on('mouseover', function showTooltip(d) { vue.renderTooltip(this, d, scale(d.value)); })
                .on('mouseleave', () => vue.hideTooltip());
            });
          },
          // Called when sorting departments
          (update) => {
            const t = d3.transition().duration(640 * 2).ease(d3.easeCubic);

            update.transition(t)
              .delay(d => d.order * 64)
              .attr('transform', d => `translate(0,${(d.order + 1) * 24})`);
          },
        );
    },
  },
  mounted() {
    this.renderViz();
  },
  watch: {
    deptosSortingMethod() {
      this.renderViz();
    },
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
  margin-left: 520px;
}

.difference-hover-tooltip {
  position: absolute;
  background-color: red;
}
</style>
