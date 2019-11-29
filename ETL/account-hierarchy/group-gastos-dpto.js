const fs = require('fs');
const Papa = require('papaparse');
const utils = require('./utils')

const createIfDoesNotExist = (parent, level) => {
  if (parent[level] === undefined) {
    parent[level] = {
      count: 0,
      value: 0,
    };
  }
}

const leavesRaw = fs.readFileSync('./results/leaves.json').toString().toLowerCase();
const leaves = JSON.parse(leavesRaw);
const leafAccounts = {};
for (const account of leaves) {
  const cleanAccount = JSON.stringify(account.toLowerCase().trim());
  leafAccounts[cleanAccount] = true;
}

const csvRaw = fs.readFileSync('./../data/gastos-filtrado.csv').toString();
const result = Papa.parse(csvRaw, { header: true });

const deptos = utils.getAllDepartments(result.data);

const groupedGastos = {};
for (const depto of deptos) {
  groupedGastos[depto] = {};
  for (const tx of result.data) {
    const txDpto = tx.NOM_DEPAR;
    const txAmbito = tx.NOM_AMB;

    try {
      const txAccount = JSON.stringify(tx.COD_CUENTA.toLowerCase().trim());

    } catch (error) {
      console.log('depta:', txDpto);
      console.log('amb:', txAmbito);
      console.log('qenta:', tx.COD_CUENTA);
    }
    const txAccount = JSON.stringify(tx.COD_CUENTA.toLowerCase().trim());

    // Only calculate for the current department
    if (depto !== txDpto) {
      continue;
    }

    // Only calculate 'ambito departamental'
    if (txAmbito !== 'ADMÓN CTRAL TERR - DEPTOS') {
      continue;
    }

    // Ignore non-leaf accounts
    if (!leafAccounts[txAccount]) {
      continue;
    }

    const destination = tx.NOM_DEST;

    // Create destination if it doesn't exist
    if (!groupedGastos[depto][destination]) {
      groupedGastos[depto][destination] = {
        count: 0,
        value: 0,
      }
    }

    const { count } = groupedGastos[depto][destination];
    const { value } = groupedGastos[depto][destination];

    const txValueRaw = tx.NETO_PAGOS.split('.').join('');
    const txValue = parseInt(txValueRaw, 10);

    groupedGastos[depto][destination].count = count + 1;
    groupedGastos[depto][destination].value = value + txValue;
  }
}

fs.writeFileSync('./results/grouped-gastos-depto.json', JSON.stringify(groupedGastos));
