import $ from './dollar';

class ConsumerOptions {

  _getConsumerOptions() {
    var options = {},
      $script = $("script[src*='/atlassian-connect/all']");

    if ( !($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr("src"))) ){
      $script = $("#ac-iframe-options");
    }

    if($script && $script.length > 0) {
      // get its data-options attribute, if any
      var optStr = $script.attr("data-options");
      if (optStr) {
        // if found, parse the value into kv pairs following the format of a style element
        optStr.split(";").forEach((nvpair) => {
          nvpair = nvpair.trim();
          if (nvpair) {
            var nv = nvpair.split(":"), k = nv[0].trim(), v = nv[1].trim();
            if (k && v != null) {
              options[k] = v === "true" || v === "false" ? v === "true" : v;
            }
          }
        });
      }
    }

    return options;
  }

  _flush() {
    delete this._options;
  }

  get(key) {
    if(!this._options) {
      this._options = this._getConsumerOptions();
    }
    if(key) {
      return this._options[key];
    }
    return this._options;
  }

}

module.exports = new ConsumerOptions();