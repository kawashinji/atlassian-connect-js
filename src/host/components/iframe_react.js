import React, { Component } from 'react';
import simpleXDM from 'simple-xdm/host';

class Iframe extends React.Component {
  render(){
    var style = {
      width: this.props.width,
      height: this.props.height
    };
    return (<iframe
      id={this.props.id}
      className="ap-iframe"
      name={this.props.name}
      src={this.props.src}
      style={style}
    />);
  }
}

Iframe.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  src: React.PropTypes.string.isRequired,
  width: React.PropTypes.string,
  height: React.PropTypes.string
};

export default Iframe;