

<template>
  <div class="viz-container">
    <div id="chart" />
    <div id="chart2" />
  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
import d3 from 'd3';

export default {
  mounted() {
    const RUTA_DATA_DICT = 'https://gist.githubusercontent.com/whatevercamps/a275475110c7bdcd5cd6cd3f392938e3/raw/1f8b3aac26ffed7a79e1a60ae0f52e4238e5f7f7/data_grid_nom_dest_dict.json';
    const RUTA_DATA_NEW = 'https://gist.githubusercontent.com/whatevercamps/ec5af4049a8ff1846bd3f767ad1826f7/raw/17c2fc9ad2e4ec6b1e5891bf022b604298c16c18/akjsdopad.json';
    d3.json(RUTA_DATA_DICT, (err, data_dict) => {
      if (err) {
        console.error(err);
        return;
      }

      d3.json(RUTA_DATA_NEW, (err, data_new) => {
        if (err) {
          console.error(err);
          return;
        }
        const datita = data_new;
        for (const i in datita) {
          for (const j in datita[i * 1].children) {
            datita[i * 1].children[j * 1] = {
              name: datita[i * 1].children[j * 1].name,
              value:
                this.irregularidades(
                  data_dict,
                  datita[i * 1].name,
                  datita[i * 1].children[j * 1].name,
                ).length || 0,
            };
          }
        }
        console.log('data_derivada', { name: 'datos', children: datita });
      });
    });
  },
  methods: {
    irregularidades(data_dict, depto, municipio) {
      const muni = data_dict[depto][municipio];

      const { ingresos } = muni;
      const { gastos } = muni;

      const io = {};

      for (const ingreso of ingresos) {
        let fila = io[ingreso];
        if (!fila) {
          io[ingreso] = {
            ingreso: false,
            gasto: false,
          };
          fila = io[ingreso];
        }

        fila.ingreso = true;
      }

      for (const gasto of gastos) {
        let fila = io[gasto];
        if (!fila) {
          io[gasto] = {
            ingreso: false,
            gasto: false,
          };
          fila = io[gasto];
        }

        fila.gasto = true;
      }

      const correctos = [];

      for (const key in io) {
        const fila = io[key];
        if ((fila.ingreso && fila.gasto) || (!fila.ingreso && !fila.gasto)) {
          correctos.push({ name: key, ...io[key] });
        }
      }

      const incorrectos = [];

      for (const key in io) {
        const fila = io[key];
        if ((!fila.ingreso && fila.gasto) || (fila.ingreso && !fila.gasto)) {
          incorrectos.push({ name: key, ...io[key] });
        }
      }

      return incorrectos;
    },
  },
};
</script>
