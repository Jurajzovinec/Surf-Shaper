import React, { Suspense, Component } from "react";
import BuildSliders from './components/BuildSliders';
import SurfsCollection from './components/SurfsCollection';
import ShiftButtons from "./components/ShiftButtons";
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      positions: []
    };
    this.changePositions = this.changePositions.bind(this);
  }
  
  changePositions(newPositions){
    this.setState({ positions: newPositions });
  }

  render() {
    return (
      <div className="App">
        <SurfsCollection positions = {this.state.positions}/>
        <ShiftButtons data={{changePositions:this.changePositions}}/>
        <BuildSliders />
      </div>
    )
  }
}


// 
export default App;