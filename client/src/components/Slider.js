import React, { Component } from 'react';

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = { values: props };
        this.displayChange = this.displayChange.bind(this);
    }

    displayChange(e) {
        e.preventDefault();
        e.target.parentElement.querySelector('span').textContent = e.target.value;
        this.props.renderSliders("surfOne", this.state.values.name, e.target.value);    
    }

    render() {
        return (
            <div>
                <p className="slider-name">
                    {this.state.values.name}
                </p>
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