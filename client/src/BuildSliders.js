import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from './Slider';

class BuildSliders extends Component {
    constructor (props) {
        console.log('Constructor')
        super(props)
        this.state = this.getParameters();
    }

    async getParameters() {
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        };
        try {
            const response = await axios.get("http://localhost:5000/configparams", headers);
            console.log(response.data);
            //setParams(response.data);
            //this.state = response.data;
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {this.state.map(eachState => {
                console.log(eachState);
                return <Slider key = {eachState.name} min = {eachState.minValue} max = {eachState.maxValue} curValue = {eachState.defValue}/>
            })}
        </div>
    );
}

export default BuildSliders;