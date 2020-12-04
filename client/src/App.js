import React, { Component } from "react";
import BuildSliders from './components/BuildSliders';
import Surf from './components/Surf';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Surf/>
        <BuildSliders/>
      </div>
    )
  } 
}


// 
export default App;