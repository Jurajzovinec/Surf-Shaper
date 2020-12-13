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
        { surf: "surfOne", position: [0, 1, 0] },
        { surf: "surfTwo", position: [1, 1, -1] },
        { surf: "surfThree", position: [-1, 1, -1] }
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
    this.renderSliders = this.renderSliders.bind(this);
    this.setActiveSliderValues = this.setActiveSliderValues.bind(this);
  }

  componentDidMount() {
    this.getParametersForSliders();
  }

  setActiveSurf() {

    const isFrontPositionSurf = (surfPosition) => surfPosition.position.toString() === [0, 1, 0].toString();
    let activeSurf = this.state.surfsCollection.find(isFrontPositionSurf);
    this.setState({ activeSurf: { surf: activeSurf.surf, sliderValues: [] } },
      () => this.setActiveSliderValues()
    );
  }

  setActiveSliderValues() {

    const isFrontPositionParams = (sliderValue) => sliderValue.surf === this.state.activeSurf.surf;
    let activeBuildValues = this.state.sliderValues.find(isFrontPositionParams);
    let currentSurfState = this.state.activeSurf.surf;
    this.setState({ activeSurf: { surf: currentSurfState, sliderValues: activeBuildValues.sliderValues } },
      () => console.log(this.state.activeSurf));
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

  getParametersForSliders() {
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };
    fetch("http://localhost:5000/configparams", headers)
      .then(response => response.json())
      .then(dimensionList => {
        this.setState({
          sliderValues: [
            { surf: "surfOne", sliderValues: dimensionList },
            { surf: "surfTwo", sliderValues: dimensionList },
            { surf: "surfThree", sliderValues: dimensionList }
          ]
        }, () => {
          console.log('Sliders loaded');
          console.log(this.state.sliderValues);
          this.setActiveSurf();
        });
      });

  }

  renderSliders(surf, dimension, newValue) {

    //console.log('Active is....');
    //console.log(this.state.activeSurf);
    const selectChangingSurf = (sliderValues) => sliderValues.surf === this.state.activeSurf.surf;
    const selectChangingDimension = (dimensions) => dimensions.name === dimension;

    // Shallow copy methods
    //let tempArray = Object.create([], this.state.sliderValues);
    // let tempArray = Array.from(this.state.sliderValues);

    // Deep copy
    let tempArray = JSON.parse(JSON.stringify(this.state.sliderValues));

    // console.log(tempArray);
    let updatedSurfCollection = tempArray.find(selectChangingSurf);
    
    // console.log('updated Collection');
    // console.log(updatedSurfCollection);
    
    let updatedDimension = updatedSurfCollection.sliderValues.find(selectChangingDimension);
    // console.log('Updated dimension is....');
    // console.log(updatedDimension);
    updatedDimension.defValue = newValue;

    // console.log('ActiveSurf is....');
    // console.log(this.state.activeSurf);
    // console.log('Global Slider Values are....');    
    // console.log(this.state.sliderValues);
    this.setState({ sliderValues: tempArray });
    // 

  }

  render() {
    return (
      <div className="App">
        <SurfsCollection positions={this.state.positions} />
        <ShiftButtons changePositions={this.changePositions} getThisState={this.getThisState} />
        <BuildSliders surf={this.state.activeSurf.surf} dimensions={this.state.activeSurf.sliderValues} renderSliders={this.renderSliders} />
      </div>
    )
  }
}

export default App;