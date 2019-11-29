const fs = require('fs')

const gastosAccountsRaw = fs.readFileSync('./results/ingresos-accounts.json');
const ingresosAccountsRaw = fs.readFileSync('./results/gastos-accounts.json');

const ingresosAccounts = JSON.parse(ingresosAccountsRaw);
const gastosAccounts = JSON.parse(gastosAccountsRaw);

const getLeaves = (parentAccounts, account) => {
  let isLeaf = true;
  for(const key of Object.keys(account)) {
    if(key !== 'count' && key !== 'value' && key !== 'name') {
      isLeaf = false;
      break;
    }
  }

  if (isLeaf) {
    return [parentAccounts.join('.')]
  }

  let leaves = [];
  for(const key of Object.keys(account)) {
    if(key !== 'count' && key !== 'value' && key !== 'name') {
      const nodeParentAccounts = [...parentAccounts, key];
      const nodeLeaves = getLeaves(nodeParentAccounts, account[key]);
      // Add this node's leaves to the list
      leaves = leaves.concat(nodeLeaves);
    }
  }

  return leaves;
}

const ingresosLeaves = getLeaves([], ingresosAccounts);
const gastosLeaves = getLeaves([], gastosAccounts);
const leaves = ingresosLeaves.concat(gastosLeaves);
fs.writeFileSync(`./results/leaves.json`, JSON.stringify(leaves));
