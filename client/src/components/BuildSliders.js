import React, { Component } from "react";
import Slider from './Slider';

class BuildSliders extends Component {
    constructor (props) {
        super(props)
        this.state = { 
            dimensions: []
        }
    }

    componentDidMount() {
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        };
        fetch("http://localhost:5000/configparams", headers)
        .then(response => response.json())
        .then(dimensionList => {
            this.setState({dimensions: dimensionList});
        })

    }

    render() {
        return (
            <ul>
                {this.state.dimensions.map((dimension) => {
                   return <Slider key = {dimension.name} min = {dimension.minValue.toString()} max = {dimension.maxValue.toString()} curValue = {dimension.defValue.toString()}/>
                })}
            </ul>
        );
    }
    
}

export default BuildSliders;