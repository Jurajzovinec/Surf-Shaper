import React, { Component } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
 
class Slider extends Component {
    constructor (props) {
        super(props)
        this.state = { values: props };
    }

    displayChange = (e) => {
        e.preventDefault();
        e.target.parentElement.querySelector('span').textContent = e.target.value;
        this.setState({ curValue: e.target.value });
    }

    componentDidMount(){
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <input type="range" 
                    min={this.state.values.min} 
                    max={this.state.values.max} 
                    className="slider" 
                    onChange={this.displayChange}>
                </input>
                <span></span>
            </div>
        )
    }
}

export default Slider;