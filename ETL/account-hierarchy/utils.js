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
  },
  codeToSimplifiedDestination(rawCode) {
    let code = rawCode;

    if(code.length === 1) code = `00${code}`
    if(code.length === 2) code = `0${code}`

    if (code === "018") return "Medio ambiente";
    if (code === "017") return "Medio ambiente";
    if (code === "019") return "Medio ambiente";
    if (code === "020") return "Medio ambiente";
    if (code === "022") return "Agua Potable y Saneamiento Básico";
    if (code === "025") return "Agua Potable y Saneamiento Básico";
    if (code === "024") return "Agua Potable y Saneamiento Básico";
    if (code === "021") return "Agua Potable y Saneamiento Básico";
    if (code === "023") return "Agua Potable y Saneamiento Básico";
    if (code === "026") return "Agua Potable y Saneamiento Básico";
    if (code === "027") return "Agua Potable y Saneamiento Básico";
    if (code === "028") return "Atención a Grupos Vulnerables";
    if (code === "030") return "Ciencia y Tecnología";
    if (code === "029") return "Ciencia y Tecnología";
    if (code === "031") return "Ciencia y Tecnología";
    if (code === "033") return "Comunicaciones";
    if (code === "032") return "Comunicaciones";
    if (code === "036") return "Comunicaciones";
    if (code === "038") return "Comunicaciones";
    if (code === "034") return "Comunicaciones";
    if (code === "035") return "Comunicaciones";
    if (code === "037") return "Comunicaciones";
    if (code === "048") return "Cultura";
    if (code === "077") return "Defensa y Seguridad";
    if (code === "075") return "Defensa y Seguridad";
    if (code === "074") return "Defensa y Seguridad";
    if (code === "050") return "Desarrollo Agropecuario";
    if (code === "049") return "Desarrollo Agropecuario";
    if (code === "051") return "Desarrollo Agropecuario";
    if (code === "053") return "Desarrollo Agropecuario";
    if (code === "052") return "Desarrollo Agropecuario";
    if (code === "064") return "Desarrollo comercial, comunitario e industrial";
    if (code === "063") return "Desarrollo comercial, comunitario e industrial";
    if (code === "062") return "Desarrollo comercial, comunitario e industrial";
    if (code === "055") return "Desarrollo comercial, comunitario e industrial";
    if (code === "057") return "Desarrollo comercial, comunitario e industrial";
    if (code === "054") return "Desarrollo comercial, comunitario e industrial";
    if (code === "056") return "Desarrollo comercial, comunitario e industrial";
    if (code === "058") return "Desarrollo comercial, comunitario e industrial";
    if (code === "061") return "Desarrollo comercial, comunitario e industrial";
    if (code === "059") return "Desarrollo comercial, comunitario e industrial";
    if (code === "060") return "Desarrollo comercial, comunitario e industrial";
    if (code === "065") return "Desarrollo comercial, comunitario e industrial";
    if (code === "109") return "Otros";
    if (code === "108") return "Otros";
    if (code === "099") return "Otros";
    if (code === "101") return "Otros";
    if (code === "006") return "Educación";
    if (code === "008") return "Educación";
    if (code === "009") return "Educación";
    if (code === "003") return "Educación";
    if (code === "004") return "Educación";
    if (code === "005") return "Educación";
    if (code === "007") return "Educación";
    if (code === "002") return "Educación";
    if (code === "072") return "Deporte y recreación";
    if (code === "071") return "Deporte y recreación";
    if (code === "070") return "Deporte y recreación";
    if (code === "073") return "Deporte y recreación";
    if (code === "066") return "Fortalecimiento institucional";
    if (code === "067") return "Fortalecimiento institucional";
    if (code === "068") return "Fortalecimiento institucional";
    if (code === "069") return "Fortalecimiento institucional";
    if (code === "105") return "Funcionamiento y pensiones";
    if (code === "106") return "Funcionamiento y pensiones";
    if (code === "081") return "Administración de justicia";
    if (code === "078") return "Administración de justicia";
    if (code === "082") return "Administración de justicia";
    if (code === "079") return "Administración de justicia";
    if (code === "080") return "Administración de justicia";
    if (code === "001") return "Libre destinación";
    if (code === "107") return "Funcionamiento y pensiones";
    if (code === "085") return "Atención a desastres";
    if (code === "083") return "Atención a desastres";
    if (code === "084") return "Atención a desastres";
    if (code === "011") return "Salud";
    if (code === "010") return "Salud";
    if (code === "016") return "Salud";
    if (code === "013") return "Salud";
    if (code === "012") return "Salud";
    if (code === "014") return "Salud";
    if (code === "015") return "Salud";
    if (code === "090") return "Sector Eléctrico";
    if (code === "089") return "Sector Eléctrico";
    if (code === "087") return "Sector Eléctrico";
    if (code === "086") return "Sector Eléctrico";
    if (code === "088") return "Sector Eléctrico";
    if (code === "091") return "Sector Minero";
    if (code === "094") return "Sector Minero";
    if (code === "092") return "Sector Minero";
    if (code === "093") return "Sector Minero";
    if (code === "098") return "Servicio de la deuda";
    if (code === "039") return "Transporte";
    if (code === "041") return "Transporte";
    if (code === "042") return "Transporte";
    if (code === "040") return "Transporte";
    if (code === "043") return "Transporte";
    if (code === "047") return "Transporte";
    if (code === "044") return "Transporte";
    if (code === "045") return "Transporte";
    if (code === "046") return "Transporte";
    if (code === "095") return "Vivienda";
    if (code === "096") return "Vivienda";
    if (code === "097") return "Vivienda";

    console.log('destino desconocido: ', code)
    return "Desconocido";
  },
}
