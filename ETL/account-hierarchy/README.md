This is the ETL for the matrix-differences viz. It consists of some js scripts that will transform and filter the data when run on node.

The scripts should be run in this order:
1. `convert-gastos.js` and `convert-ingresos.js`
2. `get-leaf-accounts.js`
3. `group-gastos-dpto.jso` and `group-ingresos-dpto.json` (or the municipalities equivalent)
4. `calculate-differences.js`

This order needs to be enforced as some scripts take as input the result of others.
