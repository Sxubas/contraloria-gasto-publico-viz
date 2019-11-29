module.exports = {
  getAllDepartments(data) {
    const departments = {};
    for (const tx of data) {
      if (!departments[tx.NOM_DEPAR]) {
        departments[tx.NOM_DEPAR] = true;
      }
    }
    return Object.keys(departments);
  },
  getAllMunicipalities(data) {
    // TODO: implement correctly
    const departments = {};
    for (const tx of data) {
      if (!departments[tx.NOM_DEPAR]) {
        departments[tx.NOM_DEPAR] = true;
      }
    }
    return Object.keys(departments);
  }
}
