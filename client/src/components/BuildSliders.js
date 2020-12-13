import React, { Component } from "react";
import Slider from './Slider';
import RcSlider from './RcSlider';

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
                <p>{this.state.surf}</p>
                <p>{this.props.surf}</p>
                <RcSlider/>

            </div>
        );
    }

}

export default BuildSliders;