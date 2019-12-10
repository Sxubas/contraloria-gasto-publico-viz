const fs = require('fs');

const gastosRaw = fs.readFileSync('./results/grouped-gastos-muni.json');
const ingresosRaw = fs.readFileSync('./results/grouped-ingresos-muni.json');
const ingresos = JSON.parse(ingresosRaw);
const gastos = JSON.parse(gastosRaw);

const municipalitites = Object.keys(ingresos);

const groupedDifferences = {};
for(const municipality of municipalitites) {
  groupedDifferences[municipality] = {};

  const ingresosDestinations = Object.keys(ingresos[municipality]);
  const gastosDestinations = Object.keys(gastos[municipality]);
  const destinations = ingresosDestinations.concat(gastosDestinations);

  for(const destination of destinations) {
    groupedDifferences[municipality][destination] = { value: 0 };

    const ingresosValue = ingresos[municipality][destination] ? ingresos[municipality][destination].value : 0;
    const gastosValue = gastos[municipality][destination] ? gastos[municipality][destination].value : 0;
    
    groupedDifferences[municipality][destination].value = ingresosValue - gastosValue;
  }
}

fs.writeFileSync('./results/grouped-differences-muni.json', JSON.stringify(groupedDifferences));

for (const municipality of Object.keys(groupedDifferences)) {
  for (const destination of Object.keys(groupedDifferences[municipality])) {
    const { value } = groupedDifferences[municipality][destination];
    groupedDifferences[municipality][destination].value = value / (1000 * 1000000) // Divide all values in 'miles de millones'
  }
}

fs.writeFileSync('./results/grouped-differences-muni-MM.json', JSON.stringify(groupedDifferences));
