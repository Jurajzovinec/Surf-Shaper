import React, { Component } from "react";
import BuildSliders from './components/BuildSliders';
import Surf from './components/Surf';

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


// 
export default App;