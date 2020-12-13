import Slider from 'rc-slider';
import React, { Component } from 'react';

class RcSlider extends Component {
	constructor(props) {
		super(props)
		const { value } = this.props;
		this.state = { value };
	}
	setValue(e) {
		this.setState({ value: e })
	}
	update() {
		this.props.update(this.state)
	}
	render() {
		return <Slider 
            value={"50"} 
            onChange={this.setValue.bind(this)} 
            onAfterChange={this.update.bind(this)} 
                
            />
	}
}

export default RcSlider;