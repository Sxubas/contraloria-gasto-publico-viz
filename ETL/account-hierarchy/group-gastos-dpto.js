const fs = require('fs');
const Papa = require('papaparse');
const utils = require('./utils')

const leavesRaw = fs.readFileSync('./results/leaves.json').toString().toLowerCase();
const leaves = JSON.parse(leavesRaw);
const leafAccounts = {};
for (const account of leaves) {
  const cleanAccount = JSON.stringify(account.toLowerCase().trim());
  leafAccounts[cleanAccount] = true;
}

const csvRaw = fs.readFileSync('./../data/gastos-filtrado-con-codigos.csv').toString();
const result = Papa.parse(csvRaw, { header: true });

const deptos = utils.getAllDepartments(result.data);

const groupedGastos = {};
for (const depto of deptos) {
  // Ignore Bogotá (it's empty)
  if (depto === 'BOGOTÁ, D. C.' || depto === 'NO APLICA') {
    continue;
  }

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

    // Only calculate 'ambito departamental' + San Andrés
    if (txAmbito !== 'ADMÓN CTRAL TERR - DEPTOS' && txAmbito !== 'ADMÓN CTRAL TERR - SAN ANDRÉS') {
      continue;
    }

    // Ignore non-leaf accounts
    if (!leafAccounts[txAccount]) {
      continue;
    }

    const destination = utils.codeToSimplifiedDestination(tx.COD_DEST);

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
