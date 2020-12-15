import React, { Component } from 'react';

class UpdateButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.configparams.sliderValues,
            activeSurf: props.configparams.surf
        };
        this.sendConfiguration = this.sendConfiguration.bind(this);
    }

    sendConfiguration() {
        //console.log(this.state.values);
        let requestParam = JSON.stringify(this.state.values);

        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        };
        fetch(`http://localhost:5000/retrievemodel/${requestParam}`, headers)
            .then(response => response.json())
            .then(gltfData => this.props.updateGltf(this.state.activeSurf, gltfData))
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
            <div className="update-config-button">
                <button onClick={this.sendConfiguration}> {'Update'} </button>
            </div>
        );
    }
}
export default UpdateButton;