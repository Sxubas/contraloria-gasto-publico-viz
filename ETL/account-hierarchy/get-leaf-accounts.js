const fs = require('fs')

const fileName = './results/gastos-accounts.json';
const ingresosAccountsRaw = fs.readFileSync(fileName);
// const gastosAccounts = fs.readFileSync('./results/ingresos-tree.json');

const ingresosAccounts = JSON.parse(ingresosAccountsRaw);

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

const leaves = getLeaves([], ingresosAccounts);
const fileType = fileName.split('/').pop().split('-')[0];
// Save as gastos-leaves or ingresos-leaves
fs.writeFileSync(`./results/${fileType}-leaves.json`, JSON.stringify(leaves));
