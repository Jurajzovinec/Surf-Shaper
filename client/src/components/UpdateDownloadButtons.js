import React, { Component } from 'react';

class UpdateDownloadButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.configparams.sliderValues,
            activeSurf: props.configparams.surf
        };
        this.sendConfiguration = this.sendConfiguration.bind(this);
        this.downloadStlData = this.downloadStlData.bind(this);
    }

    sendConfiguration() {
        let requestParam = JSON.stringify(this.state.values);

        fetch(`http://localhost:5000/retrievemodel/${requestParam}`)
            .then(response => response.json())
            .then(gltfData => this.props.updateGltf(this.state.activeSurf, gltfData))
            .catch(error => console.log(error));
    }

    downloadStlData() {

        let requestParam = JSON.stringify(this.state.values);

        const downloadStlFile = function(stlfData){
            const blob = new Blob([stlfData], {type: 'text/stl'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'SurfStl.stl');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        fetch(`http://localhost:5000/retrievemodelstl/${requestParam}`)
            .then(response =>(response.text()))
            .then(response => downloadStlFile(response))
            .catch(error => console.log(error));

     
    }

    componentWillReceiveProps(receivedProps) {

        this.setState({
            values: receivedProps.configparams.sliderValues,
            activeSurf: receivedProps.configparams.surf
        });
    }


    render() {
        return (
            <div className="update-download-buttons-container">
                <button className="btn btn1" onClick={this.sendConfiguration}> {'Update'} </button>
                <button className="btn btn2" onClick={this.downloadStlData}> {'Download STL'} </button>
            </div>
        );
    }
}
export default UpdateDownloadButtons;