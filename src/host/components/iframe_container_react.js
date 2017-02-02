import React, { Component } from 'react';
import LoadingIndicatorComponent from './loading_indicator_react';
import IframeComponent from './iframe_react';
import simpleXDM from 'simple-xdm/host';

const CONTAINER_CLASSES = ['ap-iframe-container'];

class IframeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extension: {}
    };
  }
  componentWillUnmount() {
    // simple-xdm destoy frame
    // this.state.extension.extension_id
  }
  componentWillMount(){
    var iframeAttributes = simpleXDM.create({
      addon_key: this.props.extension.addon_key,
      key: this.props.extension.module_key,
      url: this.props.extension.url
    }, () => {
      console.log('initd', arguments);
    });

    console.log('iframe attributes?', iframeAttributes);
    this.setState((prevState, props) => {
      return {
        extension: {...prevState.extension, ...iframeAttributes}
      };
    });
  }
  render() {
    var loadingIndicator = this.props.loadingIndicator ? LoadingIndicatorComponent : null;
    console.log('my state is?', this.state);
    return (
      <div className={CONTAINER_CLASSES.join(' ')}>
        <IframeComponent
          id={this.state.extension.id}
          name={this.state.extension.name}
          src={this.state.extension.src}
          width={this.state.extension.width}
          height={this.state.extension.height}
        />
        <loadingIndicator />
      </div>
    );
  }
}

IframeContainer.propTypes = {
  extension: React.PropTypes.shape({
    addon_key: React.PropTypes.string.isRequired,
    module_key: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    options: React.PropTypes.object
  }),
  loadingIndicator: React.PropTypes.bool
};

IframeContainer.defaultProps = {
  loadingIndicator: true
};

export default IframeContainer;