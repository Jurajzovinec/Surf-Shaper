import React, {Suspense, Component } from "react";
import BuildSliders from './components/BuildSliders';
import SurfsCollection from './components/SurfsCollection';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Suspense fallback={null}>
          <SurfsCollection />
        </Suspense>
        <BuildSliders />
      </div>
    )
  }
}


// 
export default App;