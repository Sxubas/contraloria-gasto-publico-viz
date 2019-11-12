<template>
  <div class="viz-container">
    <div id="chart"/>
    <div id="chart2"/>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import d3 from 'd3';

export default {
  mounted() {
    d3.json('tree.json', (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res);
      this.initViz({ key: 'Nivel nacional', values: res }, '#chart');
    });

    d3.json('tree.json', (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res);
      this.initViz({ key: 'Nivel nacional', values: res }, '#chart2');
    });
  },
  methods: {
    initViz(data, selector) {
      // ------ Constants ------
      const opts = {
        margin: {
          top: 24, right: 0, bottom: 0, left: 0,
        },
        format: ',d',
        width: (window.innerWidth / 2) - 48,
        height: window.innerHeight - 64,
      };

      const formatNumber = d3.format(opts.format);
      const { margin } = opts;
      const theight = 36 + 16;

      const width = opts.width - margin.left - margin.right;
      const height = opts.height - margin.top - margin.bottom - theight;
      let transitioning;

      let color = d3.scale.ordinal().range(['#1f77b4', '#ff7f0e', '#9467bd', '#d62728', '#8c564b']);

      if (selector === '#chart2') color = d3.scale.ordinal().range(['#17becf', '#2ca02c', '#bcbd22', '#e377c2', '#7f7f7f']);

      const x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

      const y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

      const treemap = d3.layout.treemap()
        .children((d, depth) => (depth ? null : d._children))
        .sort((a, b) => a.value - b.value)
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

      const svg = d3.select(selector).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top)
        .style('margin-left', `${-margin.left}px`)
        .style('margin-right', `${-margin.right}px`)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .style('shape-rendering', 'crispEdges');

      // ------ Viz functions ------

      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      // We also take a snapshot of the original children (_children) to avoid
      // the children being overwritten when when layout is computed.
      const accumulate = (d) => {
        d._children = d.values;

        if (d.values) {
          d.value = d.values.reduce((p, v) => p + accumulate(v), 0);
        }

        return d.value;
      };

      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1×1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent’s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1×1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      const layout = (d) => {
        if (d._children) {
          treemap.nodes({ _children: d._children });
          d._children.forEach((c) => {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      };

      const nodeText = (text) => {
        text.selectAll('tspan')
          .attr('x', d => x(d.x) + 6);
        text.attr('x', d => x(d.x) + 6)
          .attr('y', d => y(d.y) + 6)
          .style('opacity', function textOpacity(d) { return (this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0.0); });
      };

      const childText = (text) => {
        text.attr('x', function textX(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
          .attr('y', d => y(d.y + d.dy) - 6)
          .style('opacity', function textOpacity(d) { return (this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0); });
      };

      const rect = (rectSel) => {
        rectSel.attr('x', d => x(d.x))
          .attr('y', d => y(d.y))
          .attr('width', d => x(d.x + d.dx) - x(d.x))
          .attr('height', d => y(d.y + d.dy) - y(d.y));
      };

      const name = (d) => {
        if (d.parent) {
          return `${name(d.parent)} / ${d.key} (${formatNumber(d.value)})`;
        }
        return `${d.key} (${formatNumber(d.value)})`;
      };

      const chart = document.getElementById('chart');
      chart.style.height = height;
      chart.style.width = width;

      const grandparent = svg.append('g')
        .attr('class', 'grandparent');

      grandparent.append('rect')
        .attr('y', -margin.top)
        .attr('width', width)
        .attr('height', margin.top);

      grandparent.append('text')
        .attr('x', 6)
        .attr('y', 6 - margin.top)
        .attr('dy', '.75em');

      const root = data;

      root.x = 0;
      root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;

      accumulate(root);
      layout(root, treemap);
      console.log(root);
      // eslint-disable-next-line no-use-before-define
      display(root);

      function display(d) {
        grandparent
          .datum(d.parent)
          // eslint-disable-next-line no-use-before-define
          .on('click', transition)
          .select('text')
          .text(name(d))
          .attr('font-size', '0.8rem');

        const g1 = svg.insert('g', '.grandparent')
          .datum(d)
          .attr('class', 'depth');

        const g = g1.selectAll('g')
          .data(d._children)
          .enter().append('g');

        g.filter(item => item._children)
          .classed('children', true)
          // eslint-disable-next-line no-use-before-define
          .on('click', transition);

        const children = g.selectAll('.child')
          .data(item => item._children || [item])
          .enter().append('g');

        children.append('rect')
          .attr('class', 'child')
          .call(rect)
          .append('title')
          .text(item => `${item.key} (${formatNumber(item.value)})`);
        children.append('text')
          .attr('class', 'ctext')
          .text(item => item.key)
          .call(childText);

        g.append('rect')
          .attr('class', 'parent')
          .call(rect);

        const t = g.append('text')
          .attr('class', 'ptext')
          .attr('dy', '.75em');

        t.append('tspan')
          .text(item => item.key);
        t.append('tspan')
          .attr('dy', '1.0em')
          .text(item => formatNumber(item.value));
        t.call(nodeText);

        g.selectAll('rect.child')
          .style('fill', (item) => {
            if (item.parent) {
              const parentColor = color(item.parent.key);
              console.log(parentColor);

              const peerValues = item.parent.values.map(child => child.value);
              const relativeRank = d3.scale.linear()
                .domain([0, d3.max(peerValues)])
                .range([0.3, 1]);

              const interpolation = d3.interpolateRgb('whitesmoke', parentColor);
              return interpolation(relativeRank(item.value));
            }
            return color(item.key);
          });

        function transition(item) {
          if (transitioning || !item) return;
          transitioning = true;

          const g2 = display(item);
          const t1 = g1.transition().duration(750);
          const t2 = g2.transition().duration(750);

          // Update the domain only after entering new elements.
          x.domain([item.x, item.x + item.dx]);
          y.domain([item.y, item.y + item.dy]);

          // Enable anti-aliasing during the transition.
          svg.style('shape-rendering', null);

          // Draw child nodes on top of parent nodes.
          svg.selectAll('.depth').sort((a, b) => a.depth - b.depth);

          // Fade-in entering text.
          g2.selectAll('text').style('fill-opacity', 0);

          // Transition to the new view.
          t1.selectAll('.ptext').call(nodeText).style('fill-opacity', 0);
          t1.selectAll('.ctext').call(childText).style('fill-opacity', 0);
          t2.selectAll('.ptext').call(nodeText).style('fill-opacity', 1);
          t2.selectAll('.ctext').call(childText).style('fill-opacity', 1);
          t1.selectAll('rect').call(rect);
          t2.selectAll('rect').call(rect);

          // Remove the old node when the transition is finished.
          t1.remove().each('end', () => {
            svg.style('shape-rendering', 'crispEdges');
            transitioning = false;
          });
        }

        return g;
      }
    },
  },
};
</script>

<style>
.viz-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#chart {
  background: #fff;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.title {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 6px;
}
text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

rect.parent {
    pointer-events: none;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

/* this rule causes annoying occlusion
.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
} */

.children:hover rect.child {
  fill: #bbb;
}

.parent {
  transition: fill 750ms ease-in-out;
}

</style>
