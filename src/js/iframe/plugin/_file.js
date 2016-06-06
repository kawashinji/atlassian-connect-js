AP.define("_file", function (util) {
  try {
    var file = new File([], '');
  } catch (e) {
    console.warn('File constructor is not available. Enabled polyfill.');
    File = function (blob, name, options) {
      var newFile = new Blob(blob, options);
      newFile.name = name;
      return newFile;
    }
  }
})
