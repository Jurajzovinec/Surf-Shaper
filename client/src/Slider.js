import React, { Component } from 'react';

class Slider extends Component {

    state = { key: null, min: null, max: null, curValue: 0 };

    displayChange = (e) => {
        e.preventDefault();
        e.target.parentElement.querySelector('span').textContent = e.target.value;
        this.setState({ curValue: e.target.value })
    }
    render() {
        return (
            <div>
                <input type="range" min={this.state.min} max={this.state.max} value={this.state.curValue} className="slider" onChange={this.displayChange}></input>
                <span></span>
            </div>
        )
    }
}

export default Slider;