import React, { Component } from 'react';
const LOADING_INDICATOR_CLASS = 'ap-status-indicator';

const LOADING_STATUSES = {
  loading: (<div className="ap-loading"><div className="small-spinner"></div>Loading add-on...</div>),
  'load-timeout': (<div className="ap-load-timeout"><div className="small-spinner"></div>Add-on is not responding. Wait or <a href="#" className="ap-btn-cancel">cancel</a>?</div>),
  'load-error': 'Add-on failed to load.'
};

const LOADING_TIMEOUT = 12000;

class LoadingIndicator extends React.Component {

  _loadingContainer($iframeContainer){
    return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
  }

  render() {
    return (<div>i am loading...</div>);
  }
}
export default LoadingIndicator;