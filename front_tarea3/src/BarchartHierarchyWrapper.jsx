import React, { Component } from 'react'
import BarChartHierarchy from "./BarChartHierarchy.js";


export default class BarchartHierarchyWrapper extends Component {
  constructor(props) {
    super(props);
    this.laref = React.createRef();
    this.state = {
      bh: null
    }
  }

  componentDidUpdate() {
    console.log("update")
    //this.state.bh.update(this.props.data);

  }

  componentDidMount() {
    const bh = BarChartHierarchy(this.laref.current, this.props.addCityToTable);
    bh.update(this.props.data);
    this.setState({ bh: bh });
  }

  render() {
    return (
      <div>
        <div className="BarchartHierarchyWrapper">
          <div ref={this.laref}></div>
        </div>
      </div>
    )
  }
}
