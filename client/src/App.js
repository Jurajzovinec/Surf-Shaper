import React, { Suspense, Component } from "react";
import BuildSliders from './components/BuildSliders';
import SurfsCollection from './components/SurfsCollection';
import ShiftButtons from "./components/ShiftButtons";
import './App.css';


class App extends Component {

  constructor() {
    super();
    this.state = {
      positions: [[0, 1, 0], [1, 1, -1], [-1, 1, -1]],
      surfsCollection: [
        { surf: "surfOne", position: [] },
        { surf: "surfTwo", position: [] },
        { surf: "surfThree", position: [] }
      ],
      sliderValues: [
        { surf: "surfOne", sliderValues: [] },
        { surf: "surfTwo", sliderValues: [] },
        { surf: "surfThree", sliderValues: [] }
      ],
      activeSurf: {
        surf: "",
        sliderValues: []
      }
    };
    this.getParametersForSliders = this.getParametersForSliders.bind(this);
    this.changePositions = this.changePositions.bind(this);
    this.getThisState = this.getThisState.bind(this);
    this.setActiveSurf = this.setActiveSurf.bind(this);
  }

  componentDidMount() {
    this.getParametersForSliders();
    // this.setActiveSurf();
  }

  setActiveSurf() {
    const isFrontPositionSurf = (surfPosition) => surfPosition.position.toString() === [0, 1, 0].toString();
    const isFrontPositionParams = (sliderValue) => sliderValue.surf === this.state.activeSurf.surf;

    let activeSurf = this.state.surfsCollection.find(isFrontPositionSurf);
    this.setState({ activeSurf: { surf: activeSurf.surf } },
      () => {
        let activeBuildValues = this.state.sliderValues.find(isFrontPositionParams);
        this.setState({ activeSurf: { surf: activeSurf.surf, sliderValues: activeBuildValues.sliderValues } },
          () => console.log(this.state.activeSurf));
      }
    );
  }

  getThisState() {
    return this.state;
  }

  changePositions(newPositions) {

    this.setState({
      positions: newPositions,
      surfsCollection: [
        { surf: "surfOne", position: newPositions[0] },
        { surf: "surfTwo", position: newPositions[1] },
        { surf: "surfThree", position: newPositions[2] }
      ],
    }, () => this.setActiveSurf());
  }
  

  changeSliderValues({ valuesToChange }) {

  }

  getParametersForSliders() {
    // this.mounted = true;
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };
    fetch("http://localhost:5000/configparams", headers)
      .then(response => response.json())
      .then(dimensionList => {
        // this.mounted ? (this.setState({ dimensions: dimensionList })) : console.log('not mounted');
        this.setState({
          sliderValues: [
            { surf: "surfOne", sliderValues: dimensionList },
            { surf: "surfTwo", sliderValues: dimensionList },
            { surf: "surfThree", sliderValues: dimensionList }
          ]
        }, () => console.log(this.state.sliderValues));
      });

  }

  render() {
    return (
      <div className="App">
        <SurfsCollection positions={this.state.positions} />
        <ShiftButtons changePositions={this.changePositions} getThisState={this.getThisState} />
        <BuildSliders surf={this.state.activeSurf.surf} dimensions={this.state.activeSurf.sliderValues} />
      </div>
    )
  }
}

export default App;