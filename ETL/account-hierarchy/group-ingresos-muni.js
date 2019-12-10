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

const municipalities = utils.getAllMunicipalities(result.data);

const groupedIngresos = {};
for (const municipality of municipalities) {  
  groupedIngresos[municipality] = {};

  for (const tx of result.data) {
    const txMunicipality = tx.NOM_MUN;
    const txAmbito = tx.NOM_AMB;
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
    if (!groupedIngresos[municipality][destination]) {
      groupedIngresos[municipality][destination] = {
        count: 0,
        value: 0,
      }
    }

    const { count } = groupedIngresos[municipality][destination];
    const { value } = groupedIngresos[municipality][destination];

    const parse = str => parseInt(str.split('.').join(''), 10);

    const txNetoRecaudo = parse(tx.NETO_RECAUDO_EN_EFECTIVO);
    const txNetoPapeles = parse(tx.NETO_PAPELES);
    const txNetoOtrasEjec = parse(tx.NETO_OTRAS_EJEC);
    const txNetoVigencias = parse(tx.NETO_REC_VIG_ANT);

    const txTotalIncome = txNetoRecaudo + txNetoPapeles + txNetoOtrasEjec + txNetoVigencias;

    groupedIngresos[municipality][destination].count = count + 1;
    groupedIngresos[municipality][destination].value = value + txTotalIncome;
  }
}

fs.writeFileSync('./results/grouped-ingresos-muni.json', JSON.stringify(groupedIngresos));
