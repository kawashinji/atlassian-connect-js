AP.define("_file", function () {
  try {
    new File([], '');
  } catch (e) {
    File = function (data, name, options) {
      var newFile = new Blob(data, options);
      newFile.name = name;
      newFile.lastModifiedDate = new Date();
      return newFile;
    }
  }
});
