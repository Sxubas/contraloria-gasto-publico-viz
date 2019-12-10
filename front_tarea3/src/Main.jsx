import React, { Component } from 'react'
import { Container, Col, Row, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { endpoints, categorias } from './Variables';
import * as d3 from "d3";
import TableIrregularidades from "./TableIrregularidades.jsx";
import BarchartHierarchyWrapper from "./BarchartHierarchyWrapper.jsx";
import Medias from "./Medias";
export default class Main extends Component {

    state = {
        data: null,
        ciudades: [],
        catSelected: categorias[0],
        dataCategoria: null,
        rubros: [],
        dataForHist: null,
        rubroSelected: null,
        min: 0,
        max: 9999999999999999999999999999,
        dataFiltrada: null,
        rojos: [],
        minParaRojo: 0
    }

    componentWillMount() {
        d3.json(endpoints.dataBarchart).then(data => {
            this.setState({ data: data });
        });

        d3.csv("./" + this.state.catSelected + ".csv").then(datas => {

            this.setState({ dataCategoria: datas });

            let rubros = d3.map(datas, d => d.NOM_DEST).keys();
            this.setState({ rubros: rubros, rubroSelected: rubros[0] });

            let dataForH = datas.filter(d => d.NOM_DEST == this.state.rubroSelected)
            this.setState({ dataForHist: dataForH })
        })
    }

    addCityToTable = city => {
        console.log("datos tabla", { ciudades: this.state.ciudades, city: city })
        const { ciudades } = this.state;
        ciudades.push(city.data);
        console.log("add node", ciudades);
        this.setState({ ciudades: ciudades });
    }

    cambiarRango = (min, max) => {
        this.setState({ min: min, max: max })
    }

    cambiarMinParaRojo = (minParaRojo) => {
        this.setState({ minParaRojo: minParaRojo })
        console.log("prev para rojos", { dataCategoria: this.state.dataCategoria })
        const rojos = this.state.dataCategoria.filter(d => d.PAGOS * 1 > minParaRojo && d.NOM_DEST == this.state.rubroSelected).map(d => d.NOM_MUN);
        console.log("rojos", { min: minParaRojo, rojos: rojos })
        this.setState({ rojos: rojos })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.rojos != this.state.rojos) {
            const { data } = this.state;
            if (data) {
                this.state.rojos.forEach(rojo => {
                    for (var i = 0; i < data.children.length; i++) {
                        console.log("act deptAct", depAct);
                        var depAct = data.children[i];
                        var tieneMunsRojos = false;
                        var municipios = depAct.children;
                        for (var j = 0; j < municipios.length; j++) {
                            var munAct = municipios[j]
                            if (munAct.name == rojo) {
                                munAct.color = "red";
                                depAct.children[j] = munAct;
                                tieneMunsRojos = true;
                            }
                        }
                        if (tieneMunsRojos) {
                            depAct.color = "red";
                        }
                        data.children[i] = depAct;
                    }
                });
                console.log("act rojos", data)
                this.setState({ data: data })
            }
        }


        if (prevState.min != this.state.min || prevState.max != this.state.max) {

            const { data, dataFiltrada } = this.state;

            let munsValidos = this.state.dataCategoria.filter(d => d.PAGOS > this.state.min && d.PAGOS < this.state.max).map(d => d.NAME);

            dataFiltrada = data.children.filter(dep => {
                let depValido = false;
                munsValidos.forEach(mun => {
                    if (dep.find(mund => mund.name == mun))
                        depValido = true
                })
            })

        }

        if (this.state.catSelected != prevState.catSelected)
            d3.csv("./" + this.state.catSelected + ".csv").then(datas => {

                this.setState({ dataCategoria: datas });

                let rubros = d3.map(datas, d => d.NOM_DEST).keys();
                this.setState({ rubros: rubros, rubroSelected: rubros[0] });

                let dataForH = datas.filter(d => d.NOM_DEST == this.state.rubroSelected)
                this.setState({ dataForHist: dataForH })
            })

        if (this.state.rubroSelected != prevState.rubroSelected) {
            let dataForH = this.state.dataCategoria.filter(d => d.NOM_DEST == this.state.rubroSelected)
            this.setState({ dataForHist: dataForH })
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.data && this.state.dataForHist? (
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <Dropdown style={{ display: "inline", margin: "5px" }}>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            Categoria {this.state.catSelected}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {categorias.map((cat, index) => {
                                                return <Dropdown.Item key={index} onClick={() => this.setState({ catSelected: cat })}>{cat}</Dropdown.Item>
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {
                                        this.state.rubros && this.state.rubros.length > 0 ?
                                            (<Dropdown style={{ display: "inline", margin: "5px" }}>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    Rubro {this.state.rubroSelected}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {this.state.rubros.map((rubro, index) => {
                                                        return <Dropdown.Item key={index} onClick={() => this.setState({ rubroSelected: rubro })}>{rubro}</Dropdown.Item>
                                                    })}
                                                </Dropdown.Menu>
                                            </Dropdown>)
                                            : (
                                                <></>
                                            )
                                    }

                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Medias minParaRojo={this.props.minParaRojo} cambiarMinParaRojo={this.cambiarMinParaRojo} cambiarRango={this.cambiarRango} dataForHist={this.state.dataForHist} />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <BarchartHierarchyWrapper data={this.state.data} addCityToTable={this.addCityToTable}></BarchartHierarchyWrapper>
                                </Col>
                                <Col lg={6}>
                                    {
                                        this.state.ciudades && this.state.ciudades.length > 0 ?
                                            <TableIrregularidades ciudades={this.state.ciudades}></TableIrregularidades>
                                            : <></>
                                    }
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                            <></>
                        )
                }
            </div>
        )
    }
}
