import React, { Component } from "react";
import BuildSliders from './components/BuildSliders';
import ThreeDWorld from './components/ThreeDWorld';
import ShiftButtons from "./components/ShiftButtons";
import UpdateDownloadButtons from "./components/UpdateDownloadButtons";
import InfoWaitModal from "./components/InfoWaitModal";
import GitHubReference from "./components/GitHubReference";
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
      },
      gltfData: [
        { surf: "surfOne", data3D: undefined },
        { surf: "surfTwo", data3D: undefined },
        { surf: "surfThree", data3D: undefined }
      ],
      isLoadingUpdatedSurf: false,
      fireInfoModal: false
    };
    this.getParametersForSliders = this.getParametersForSliders.bind(this);
    this.changePositions = this.changePositions.bind(this);
    this.getThisState = this.getThisState.bind(this);
    this.setActiveSurf = this.setActiveSurf.bind(this);
    this.renderSliders = this.renderSliders.bind(this);
    this.setActiveSliderValues = this.setActiveSliderValues.bind(this);
    this.getDefaultGltfData = this.getDefaultGltfData.bind(this);
    this.updateGltf = this.updateGltf.bind(this);
    this.setLoadState = this.setLoadState.bind(this);
    this.fireInfoModal = this.fireInfoModal.bind(this);
  }

  componentDidMount() {
    this.getParametersForSliders();
    this.getDefaultGltfData();
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
    this.setState({ activeSurf: { surf: currentSurfState, sliderValues: activeBuildValues.sliderValues } });
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

  getDefaultGltfData() {
    fetch("http://localhost:5000/defaultmodel")
      .then(response => response.json())
      .then(defaultGltfData => {
        this.setState({
          gltfData: [
            { surf: "surfOne", data3D: defaultGltfData },
            { surf: "surfTwo", data3D: defaultGltfData },
            { surf: "surfThree", data3D: defaultGltfData }
          ]
        }, () => {
          console.log('Gltf Data Received loaded');
          console.log(this.state.gltfData);
        });
      });

  }

  renderSliders(dimension, newValue) {

    const selectChangingSurf = (sliderValues) => sliderValues.surf === this.state.activeSurf.surf;
    const selectChangingDimension = (dimensions) => dimensions.name === dimension;
    let tempArray = JSON.parse(JSON.stringify(this.state.sliderValues));
    let updatedSurfCollection = tempArray.find(selectChangingSurf);
    let updatedDimension = updatedSurfCollection.sliderValues.find(selectChangingDimension);
    updatedDimension.defValue = newValue;
    this.setState({ sliderValues: tempArray }, () => this.setActiveSliderValues());

  }

  getParametersForSliders() {

    fetch("http://localhost:5000/configparams")
      .then(response => response.json())
      .then(dimensionList => {
        this.setState({
          sliderValues: [
            { surf: "surfOne", sliderValues: dimensionList },
            { surf: "surfTwo", sliderValues: dimensionList },
            { surf: "surfThree", sliderValues: dimensionList }
          ]
        }, () => {
          this.setActiveSurf();

        });
      });
  }

  updateGltf(activeSurf, gltfData) {

    const selectChangingSurf = (gltfDataDict) => gltfDataDict.surf === activeSurf;

    let tempArray = JSON.parse(JSON.stringify(this.state.gltfData));
    let updatedGltfData = tempArray.find(selectChangingSurf);
    updatedGltfData.data3D = gltfData;
    this.setState({ gltfData: tempArray });

  }

  setLoadState(bool) {
    bool ? this.setState({ isLoadingUpdatedSurf: true }) : this.setState({ isLoadingUpdatedSurf: false })
  }

  fireInfoModal(){
    this.setState({fireInfoModal: true});
    setTimeout(()=>this.setState({fireInfoModal: false}), 3000);
  }


  render() {
    return (
      <div className="App">
        <ThreeDWorld
          positions={this.state.positions}
          gltfData={this.state.gltfData}
          isLoadingUpdatedSurf={this.state.isLoadingUpdatedSurf} 
          />
        <BuildSliders
          surf={this.state.activeSurf.surf}
          dimensions={this.state.activeSurf.sliderValues}
          renderSliders={this.renderSliders} 
          />
        <div className="control-buttons">
          <ShiftButtons
            changePositions={this.changePositions}
            getThisState={this.getThisState}
            isLoadingUpdatedSurf={this.state.isLoadingUpdatedSurf}
            fireInfoModal={this.fireInfoModal}
          />
          <UpdateDownloadButtons
            isLoadingUpdatedSurf={this.state.isLoadingUpdatedSurf}
            configparams={this.state.activeSurf}
            updateGltf={this.updateGltf}
            getThisState={this.getThisState}
            setLoadState={this.setLoadState}
            fireInfoModal={this.fireInfoModal}
          />
        </div>
        <GitHubReference />
        <InfoWaitModal fireInfoModal={this.state.fireInfoModal} />
      </div>
    )
  }
}

//<BackgroundImg/>

export default App;