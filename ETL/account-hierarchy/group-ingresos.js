const fs = require('fs');
const Papa = require('papaparse');

const createIfDoesNotExist = (parent, level) => {
  if(parent[level] === undefined) {
    parent[level] = { 
      count: 0,
      value: 0,
    };
  }
}

const leavesRaw = fs.readFileSync('./results/ingresos-leaves.json');
const leaves = JSON.parse(leavesRaw);

const csvRaw = fs.readFileSync('./../data/Ingresos filtrado.csv').toString();
const result = Papa.parse(csvRaw, { header: true });

const groupedIngresos = {};

for(const tx of result.data) {
  const txAccount = tx.COD_CUENTA;

  // Ignore non-leaf accounts TODO fix
  if(!leaves.includes(txAccount)) {
    return;
  }

  const origin = tx.NOM_ORIG;
  const destination = tx.NOM_DEST;

  // Create origin if it doesn't exist
  if(!groupedIngresos[origin]) {
    groupedIngresos[origin] = {};
  }

  // Create destination if it doesn't exist
  if(!groupedIngresos[origin][destination]) {
    groupedIngresos[origin][destination] = {
      count: 0,
      value: 0,
    }
  }

  const { count } = groupedIngresos[origin][destination];
  const { value } = groupedIngresos[origin][destination];
  const txValue = parseInt(tx.APR_DEFINITIVA, 10);

  groupedIngresos[origin][destination].count = count + 1;
  groupedIngresos[origin][destination].value = value + txValue;
}

fs.writeFileSync('./results/grouped-ingresos.json', JSON.stringify(groupedIngresos));
