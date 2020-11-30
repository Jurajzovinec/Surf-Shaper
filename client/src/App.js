import React, { Component } from "react";
import './App.css';
import BuildSliders from './BuildSliders';
import Surfboard from './Surfboard/Surfboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Surfboard/>
        <BuildSliders/>
      </div>
    )
  } 
}

export default App;
