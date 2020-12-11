import React, { Component } from "react";
import Slider from './Slider';

class BuildSliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: props.dimensions
        };
        // this.props.renderSliders = this.props.renderSliders.bind(this);
    }

    componentDidUpdate() {
        if (this.state.dimensions.length === 0) {
            this.setState({ dimensions: this.props.dimensions });
        }
    }

    render() {
        return (
            <div className="sliders">
                {this.state.dimensions.map((dimension) => {
                    return <Slider
                        key={dimension.name}
                        name={dimension.name}
                        min={dimension.minValue.toString()}
                        max={dimension.maxValue.toString()}
                        curValue={dimension.defValue.toString()}
                        renderSliders={this.props.renderSliders}
                    />
                })}
            </div>
        );
    }

}

export default BuildSliders;