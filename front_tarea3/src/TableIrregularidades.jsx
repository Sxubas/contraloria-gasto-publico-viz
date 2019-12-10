import React, { Component } from 'react'
import GridChart from "./GridChart.js";


export default class TableIrregularidades extends Component {

  constructor(props) {
    super(props);
    this.laref = React.createRef();
  }

  componentDidMount() {
    const gc = GridChart(this.props.ciudades || [], this.laref.current);
    gc.pintar();
  }

  componentDidUpdate() {
    const gc = GridChart(this.props.ciudades ||  [], this.laref.current);
    gc.pintar();
  }

  render() {
    return (
      <div className="TableroIrregularidadesClass">
        <div ref={this.laref}></div>
      </div>
    )
  }
}


// import React, { useRef, useEffect } from "react";
// import PropTypes from "prop-types";

// import GridChart from "./GridChart.js";

// const TableroIrregularidades = props => {

//   const targetRef = useRef(null);

//   useEffect(() => {
//     const gc = GridChart(props.ciudades || [], targetRef.current);
//     gc.pintar();
//   });

//   return (
//     <div className="TableroIrregularidades">
//       <div ref={targetRef}></div>
//     </div>
//   );
// };

// TableroIrregularidades.propTypes = {
//   ciudades: PropTypes.array.isRequired
// };

// export default TableroIrregularidades;