const Papa = require('papaparse');
const fs = require('fs');

const getDeptosMunis = (path) => {
  const file = fs.readFileSync(path).toString();
  const result = Papa.parse(file, {header: true});
  print("[Rows read]: ", result.data.length)

  const deptosMunis = {};

  for (const tx of result.data) {
    const depto = tx.NOM_DEPAR;
    const muni = tx.NOM_MUN;
    
    if(!deptosMunis[depto]) {
      deptosMunis[depto] = {};
    }

    deptosMunis[depto][muni] = true;
  }

  return deptosMunis;
}

const print = (...args) => console.log(...args);

const deptosMunis = getDeptosMunis('./../data/gastos-filtrado-con-codigos.csv', true); // use gastos as it is bigger
fs.writeFileSync('./results/deptos-munis.json', JSON.stringify(deptosMunis));
