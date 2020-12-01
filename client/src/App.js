import React, { Component } from "react";
import './App.css';
import BuildSliders from './BuildSliders';
import Surf from './Surf'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BuildSliders/>
        <Surf/>
      </div>
    )
  } 
}

export default App;
