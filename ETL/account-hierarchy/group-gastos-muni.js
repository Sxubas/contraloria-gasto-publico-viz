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

const municipalities = utils.getAllMunicipalities(result.data);

const groupedGastos = {};
for (const municipality of municipalities) {
  groupedGastos[municipality] = {};

  for (const tx of result.data) {
    const txMunicipality = tx.NOM_MUN;
    const txAmbito = tx.NOM_AMB;

    try {
      const txAccount = JSON.stringify(tx.COD_CUENTA.toLowerCase().trim());

    } catch (error) {
      console.log('depta:', txMunicipality);
      console.log('amb:', txAmbito);
      console.log('qenta:', tx.COD_CUENTA);
    }
    const txAccount = JSON.stringify(tx.COD_CUENTA.toLowerCase().trim());

    // Only calculate for the current department
    if (municipality !== txMunicipality) {
      continue;
    }

    // Only calculate 'ambito municipal' + Providencia (San Andrés)
    if (txAmbito !== 'ADMÓN CTRAL TERR - MUNICIPIOS' && txAmbito !== 'ADMÓN CTRAL TERR - PROVIDENCIA') {
      continue;
    }

    // Ignore non-leaf accounts
    if (!leafAccounts[txAccount]) {
      continue;
    }

    const destination = utils.codeToSimplifiedDestination(tx.COD_DEST);

    // Create destination if it doesn't exist
    if (!groupedGastos[municipality][destination]) {
      groupedGastos[municipality][destination] = {
        count: 0,
        value: 0,
      }
    }

    const { count } = groupedGastos[municipality][destination];
    const { value } = groupedGastos[municipality][destination];

    const txValueRaw = tx.NETO_PAGOS.split('.').join('');
    const txValue = parseInt(txValueRaw, 10);

    groupedGastos[municipality][destination].count = count + 1;
    groupedGastos[municipality][destination].value = value + txValue;
  }
}

fs.writeFileSync('./results/grouped-gastos-muni.json', JSON.stringify(groupedGastos));
