AP.define("_file", function () {
  try {
    new File([], '');
  } catch (e) {
    console.warn('File constructor is not available. Enabled polyfill.');
    File = function (data, name, options) {
      var newFile = new Blob(data, options);
      newFile.name = name;
      newFile.lastModifiedDate = new Date();
      return newFile;
    }
  }
});
