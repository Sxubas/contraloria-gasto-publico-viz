import React, { Component } from 'react'
import Histograma from './Histograma.js';
import * as d3 from "d3";
export default class Medias extends Component {

    constructor(props) {
        super(props);
        this.laref = React.createRef();

        this.state = {
            hs: null
        }
    }


    componentDidMount() {
        console.log("pre filter mount", {dataForHist: this.props.dataForHist});
        let valores = this.props.dataForHist.map(d => d.PAGOS * 1);
        console.log("pre pintar", valores)
        const hs = Histograma(this.laref.current, valores, this.props.cambiarRango, this.props.minParaRojo, this.props.cambiarMinParaRojo);
        hs.pintar();

        this.setState({ hs: hs })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("pre filter update", {dataForHist: this.props.dataForHist});
        if (prevProps.dataForHist != this.props.dataForHist) {
            const { hs } = this.state;
            let valores = this.props.dataForHist.map(d => d.PAGOS * 1);
            console.log("pre update", valores)
            hs.update(valores);
        }
    }


    render() {
        return (
            <div className="Medias">
                <div ref={this.laref}></div>
            </div>
        )
    }
}
