const Papa = require('papaparse');
const fs = require('fs');

const convert = (path, save) => {
  const file = fs.readFileSync(path).toString();
  const result = Papa.parse(file, {header: true});
  print("[Rows read]: ", result.data.length)

  const accounts = {};

  for (const tx of result.data) {
    const hierarchy = tx.COD_CUENTA.trim().split('.');
    let parent = accounts;

    for (const level of hierarchy) {
        createIfDoesNotExist(parent, level);
        parent = parent[level];
    }

    if (parent.name && parent.name !== tx.NOM_CUENTA) {
      print('[diferentes]: ', parent.name, tx.NOM_CUENTA);
    }

    parent.value += parseInt(tx.PAGOS.replace('.', ''), 10);
    parent.name = tx.NOM_CUENTA;
    parent.count += 1;
  }

  if (save) {
    fs.writeFileSync('./results/gastos-accounts.json', JSON.stringify(accounts));
  }

  return accounts;
}

const createIfDoesNotExist = (parent, level) => {
  if(parent[level] === undefined) {
    parent[level] = { 
      count: 0,
      value: 0,
    };
  }
}

const convertToTree = (accounts) => {
  const children = Object.keys(accounts).filter(key => key != 'value' && key != 'name' && key != 'count');
  
  if (children.length === 0){
    return accounts.value
  }

  const nodes = [];

  for (const childKey of children) {
    const childAccounts = accounts[childKey];
    const childNode = {
      // Use key and values to match d3 data structure requirement
      key: childAccounts.name,
      values: convertToTree(childAccounts),
    };

    // If the children is a number, rename the attribute to 'value'
    if (typeof childNode.values === 'number') {
      childNode.value = childNode.values;
      delete childNode.values;
    }

    nodes.push(childNode);
  }

  return nodes;
}

const print = (...args) => console.log(...args);


const accounts = convert('./../data/gastos-filtrado-con-codigos.csv', true);
const tree = convertToTree(accounts, []);
fs.writeFileSync('./results/gastos-tree.json', JSON.stringify(tree)); // used for treemap viz
