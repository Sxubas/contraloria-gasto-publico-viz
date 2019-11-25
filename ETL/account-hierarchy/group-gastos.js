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

const leavesRaw = fs.readFileSync('./results/gastos-leaves.json').toString().toLowerCase();
const leaves = JSON.parse(leavesRaw);
const leafAccounts = {};
for(const account of leaves) {
  const cleanAccount = JSON.stringify(account.toLowerCase().trim());
  leafAccounts[cleanAccount] = true;
}

const csvRaw = fs.readFileSync('./../data/Gastos filtrado.csv').toString();
const result = Papa.parse(csvRaw, { header: true });

const groupedGastos = {};

for(const tx of result.data) {
  const txAccount = JSON.stringify(tx.COD_CUENTA.toLowerCase().trim());
  
  // Ignore non-leaf accounts
  if(!leafAccounts[txAccount]) {
    continue;
  }

  const origin = tx.NOM_ORIG;
  const destination = tx.NOM_DEST;

  // Create origin if it doesn't exist
  if(!groupedGastos[origin]) {
    groupedGastos[origin] = {};
  }

  // Create destination if it doesn't exist
  if(!groupedGastos[origin][destination]) {
    groupedGastos[origin][destination] = {
      count: 0,
      value: 0,
    }
  }

  const { count } = groupedGastos[origin][destination];
  const { value } = groupedGastos[origin][destination];
  
  const txValueRaw = tx.APR_DEFINITIVA.split('.').join('');
  const txValue = parseInt(txValueRaw, 10);

  groupedGastos[origin][destination].count = count + 1;
  groupedGastos[origin][destination].value = value + txValue;
}

fs.writeFileSync('./results/grouped-gastos.json', JSON.stringify(groupedGastos));
