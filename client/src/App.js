import React, { Suspense, Component } from "react";
import BuildSliders from './components/BuildSliders';
import SurfsCollection from './components/SurfsCollection';
import ShiftButtons from "./components/ShiftButtons";
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      positions: [[0, 1, 0], [-1, 1, 2], [2, 1, 1]]
    };
    this.changePositions = this.changePositions.bind(this);
    this.getThisState = this.getThisState.bind(this);
  }

  componentDidMount() {
    //this.setState({ positions: [[0, 1, 0], [-1, 1, 2], [2, 1, 1]] });
    //console.log('PositionsOnMount');
    //this.state.positions.forEach(element => console.log(element));
  }

  getThisState(){
    console.log('Get his state');
    this.state.positions.forEach(element => console.log(element));
    return this.state;
  }

  changePositions(newPositions) {

    // console.log('Previous position');
    // this.state.positions.forEach(element => console.log(element));

    //console.log('New position is');
    //newPositions.forEach(element => console.log(element));

    this.setState({ positions: newPositions });
    
    //console.log('Updated');
    //this.state.positions.forEach(element => console.log(element));
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <SurfsCollection positions={this.state.positions} />
        <ShiftButtons changePositions={this.changePositions} getThisState={this.getThisState} />
        <BuildSliders />
      </div>
    )
  }
}

// 
// <ShiftButtons changePositions={this.changePositions}  />
// defaultPositions={this.state.positions}
export default App;