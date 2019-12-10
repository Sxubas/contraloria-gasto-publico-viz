const Papa = require('papaparse');
const fs = require('fs');

const convert = (path, saveAccounts, saveTrees) => {
  const file = fs.readFileSync(path).toString();
  const result = Papa.parse(file, {header: true});
  print("[Rows read]: ", result.data.length)

  const accounts = {};
  const deptos = getAllDepartments(result.data);

  for(const depto of deptos) {
    for (const tx of result.data) {
      // Only sum tx's of the same department
      if(depto !== tx.NOM_DEPAR) {
        break;
      }

      const hierarchy = tx.COD_CUENTA.trim().split('.');
      let parent = accounts;
  
      for (const level of hierarchy) {
          createIfDoesNotExist(parent, level);
          parent = parent[level];
      }
  
      if (parent.name && parent.name !== tx.NOM_CUENTA) {
        print('[diferentes]: ', parent.name, tx.NOM_CUENTA);
      }
  
      // parent.value += parseInt(tx.APR_DEFINITIVA.replace('.', ''), 10);
      parent.value += parseInt(tx.NETO_CDP.replace('.', ''), 10);
      parent.name = tx.NOM_CUENTA;
      parent.count += 1;
    }
  
    if (saveAccounts) {
      fs.writeFileSync(`./results/gastos-depto/${depto}-accounts.json`, JSON.stringify(accounts));
    }
  
    const tree = convertToTree(accounts, []);
    if (saveTrees) {
      fs.writeFileSync(`./results/gastos-depto/${depto}-tree.json`, JSON.stringify(tree));
    }
  }

  
}

const getAllDepartments = (data) => {
  const departments = {};
  for(const tx of data) {
    if(!departments[tx.NOM_DEPAR]) {
      departments[tx.NOM_DEPAR] = true;
    }
  }
  return Object.keys(departments);
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

convert('./../data/Gastos filtrado.csv', false, true);
