import React, { Component } from "react";
import Slider from './Slider';

class BuildSliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: props.dimensions
        };
        this.changeCurrentValueInDimensionList = this.changeCurrentValueInDimensionList.bind(this);
    }

    componentDidUpdate(){
        // this.setState({dimensions: this.props.dimensions});
        console.log(this.props);
        console.log(this.state);
    }

    changeCurrentValueInDimensionList(name, currentValue) {
        console.log("Caf ty primitif");
    }

    render() {
        return (
            <div className="sliders">
                {this.state.dimensions.map((dimension) => {
                    return <Slider
                        key={dimension.name}
                        min={dimension.minValue.toString()}
                        max={dimension.maxValue.toString()}
                        curValue={dimension.defValue.toString()}
                        />
                })}
            </div>
        );
    }

}

// changeCurrentValueInDimensionList={this.changeCurrentValueInDimensionList} />
export default BuildSliders;