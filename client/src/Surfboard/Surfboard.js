import React, { Component } from 'react';

class Surfboard extends Component {
    constructor(props) {
        super(props)
        this.state = { gltfModelData: [] };
    }
    componentDidMount() {
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        };
        fetch("http://localhost:5000/retrievemodel", headers)
            //.then(response => response.json())
            .then(gltfModelData => {
                this.setState({ gltfModelData: gltfModelData });
                console.log(this.state.gltfModelData);
            })
    }
    render() {
        return (
            <div>
                <p>text</p>
            </div>
        )
    }
}

// <p>{this.state.gltfModelData}</p>
 
export default Surfboard;