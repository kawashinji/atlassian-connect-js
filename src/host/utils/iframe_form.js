import qs from 'query-string';

class IframeFormUtils {

  randomIdentifier(){
    return 'iframe_form_' + this._random();
  }

  randomTargetName(){
    return 'iframe_' + this._random();
  }

  _random() {
    return Math.random().toString(16).substring(7);
  }

  dataFromUrl(str) {
    return qs.parse(qs.extract(str));
  }

  urlWithoutData(str) {
    return str.split('?')[0];
  }
}

var IframeFormUtilsInstance = new IframeFormUtils();

export default IframeFormUtilsInstance;