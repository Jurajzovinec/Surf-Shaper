import React, { Component } from 'react';

class ShiftButtons extends Component {
    constructor(props) {
        super(props);
        /* this.state = {
            positions: [[0, 1, 0], [-1, 1, 2], [2, 1, 1]]
            //positions: []
        }; */
        this.shiftLeft = this.shiftLeft.bind(this);
        this.shiftRight = this.shiftRight.bind(this);
    }

    componentDidMount(){
        //console.log('ShifButtons mounted, current positions are below');
        //this.props.changePositions(this.state.positions);
        //this.setState({positions: this.props.defaultPositions});
        //console.log(this.state.positions);
        //console.log(this.props);
    }

    shiftLeft() {
        let changingArray = this.props.getThisState().positions;
        changingArray.unshift(changingArray.pop());
        this.props.changePositions(changingArray);     
    }

    shiftRight() {       
        let changingArray = this.props.getThisState().positions;
        changingArray.push(changingArray.shift());
        this.props.changePositions(changingArray);      
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
