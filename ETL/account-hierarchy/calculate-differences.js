const fs = require('fs');

const gastosRaw = fs.readFileSync('./results/grouped-gastos-depto.json');
const ingresosRaw = fs.readFileSync('./results/grouped-ingresos-depto.json');
const ingresos = JSON.parse(ingresosRaw);
const gastos = JSON.parse(gastosRaw);

const deptos = Object.keys(ingresos);

const groupedDifferences = {};
for(const depto of deptos) {
  groupedDifferences[depto] = {};

  const ingresosDestinations = Object.keys(ingresos[depto]);
  const gastosDestinations = Object.keys(gastos[depto]);
  const destinations = ingresosDestinations.concat(gastosDestinations);

  for(const destination of destinations) {
    groupedDifferences[depto][destination] = { value: 0 };

    const ingresosValue = ingresos[depto][destination] ? ingresos[depto][destination].value : 0;
    const gastosValue = gastos[depto][destination] ? gastos[depto][destination].value : 0;
    
    groupedDifferences[depto][destination].value = ingresosValue - gastosValue;
  }
}

fs.writeFileSync('./results/grouped-differences.json', JSON.stringify(groupedDifferences));
