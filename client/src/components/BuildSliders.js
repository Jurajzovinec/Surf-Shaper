import React, { Component } from "react";
import Slider from './Slider';

class BuildSliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: props.dimensions,
            surf: props.surf
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ dimensions: nextProps.dimensions, surf: nextProps.surf });
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
                        correspondingSurf={this.props.surf}
                    />
                })}
            </div>
        );
    }

}

export default BuildSliders;