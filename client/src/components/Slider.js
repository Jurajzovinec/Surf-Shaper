import React, { Component } from 'react';

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = { values: props };
        this.displayChange = this.displayChange.bind(this);
    }

    displayChange(e) {
        e.preventDefault();

        //console.log('The state is below on slider');
        ///console.log(this.state);
        e.target.parentElement.querySelector('span').textContent = e.target.value;
        //this.state.values.min = 780;
        //let tempArray = this.state.values;
        //tempArray.curValue = e.target.value;
        console.log('Printujem Temp Array');
        //console.log(tempArray);
        //this.setState({ values:{curValue: e.target.value} });
        //this.setState({ values: { curValue: e.target.value } });
        // this.props.changeCurrentValueInDimensionList(this.state.values.name, this.state.curValue);
        //console.log('The  updated state is below on slider');
        //console.log(this.state);
    }

    componentDidMount() {
        //console.log('Props are following');
        //console.log(this.state);
    }

    componentWillUnmount() {
        //console.log(this.state);
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