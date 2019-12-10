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

const csvRaw = fs.readFileSync('./../data/ingresos-filtrado-con-codigos.csv').toString();
const result = Papa.parse(csvRaw, { header: true });

const deptos = utils.getAllDepartments(result.data);

const groupedIngresos = {};
for (const depto of deptos) {
  // Ignore Bogotá (it's empty)
  if (depto === 'BOGOTÁ, D. C.' || depto === 'NO APLICA') {
    continue;
  }
  
  groupedIngresos[depto] = {};

  for (const tx of result.data) {
    const txDpto = tx.NOM_DEPAR;
    const txAmbito = tx.NOM_AMB;
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
    if (!groupedIngresos[depto][destination]) {
      groupedIngresos[depto][destination] = {
        count: 0,
        value: 0,
      }
    }

    const { count } = groupedIngresos[depto][destination];
    const { value } = groupedIngresos[depto][destination];

    const parse = str => parseInt(str.split('.').join(''), 10);

    const txNetoRecaudo = parse(tx.NETO_RECAUDO_EN_EFECTIVO);
    const txNetoPapeles = parse(tx.NETO_PAPELES);
    const txNetoOtrasEjec = parse(tx.NETO_OTRAS_EJEC);
    const txNetoVigencias = parse(tx.NETO_REC_VIG_ANT);

    const txTotalIncome = txNetoRecaudo + txNetoPapeles + txNetoOtrasEjec + txNetoVigencias;

    groupedIngresos[depto][destination].count = count + 1;
    groupedIngresos[depto][destination].value = value + txTotalIncome;
  }
}

fs.writeFileSync('./results/grouped-ingresos-depto.json', JSON.stringify(groupedIngresos));
