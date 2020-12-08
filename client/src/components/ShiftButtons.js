import React, { Component } from 'react';

class ShiftButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [[0, 1, 0], [-1, 1, 2], [2, 1, 1]]
        };
        this.shiftLeft = this.shiftLeft.bind(this);
        this.shiftRight = this.shiftRight.bind(this);
    }

    componentDidMount(){
        this.props.data.changePositions(this.state.positions);
    }
    

    shiftLeft() {
        this.state.positions.push(this.state.positions.shift()); 
        this.props.data.changePositions(this.state.positions);
    }

    shiftRight() {
        this.state.positions.unshift(this.state.positions.pop());
        this.props.data.changePositions(this.state.positions);
    }
    render() {
        return (
            <div className="shift-buttons">
                <button onClick={this.shiftLeft}> {'<-'} </button>
                <button onClick={this.shiftRight}> {'->'} </button>
                <span>{"Hello kokoteeero"}</span>
            </div>
        );
    }
}

export default ShiftButtons;
