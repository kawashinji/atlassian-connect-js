var fs = require('graceful-fs');
var _ = require('lodash');

module.exports = function () {
  var parse = require('jsdoc-parse');

  function runKarma(options, karmaDone) {
    options = _.assign(options, {
      configFile: process.cwd() + '/spec/config/karma.example.conf'
    }, options);
    require('karma').server.start(options, karmaDone);
  }

  function escapeExample(str) {
    // fix quotes
    var newstring = '"' + str.replace(/([\"\'])/g,"\\$1") + '"';
    // remove new lines
    return newstring.replace(/(\r\n|\n|\r)/gm, "");
  }

  function makeJasmineTests(testCases){
    var testdir = 'spec/exampletests';
    var filename = 'test_spec.js';
    var filepath = testdir + '/' + filename;

    try {
      fs.unlinkSync(filepath);
      fs.rmdirSync(testdir);
    } catch (e){
      // console.error(e);
    }
    fs.mkdirSync(testdir);
    var fileContents = 'describe("doco tests", function(){';

    testCases.forEach(function(testcase){
      fileContents += '\ndescribe("' + testcase.testName + '", function(){';
      fileContents += "\nbeforeEach(function(){\n" + testcase.beforeEach + "\n});";
      fileContents += "\nafterEach(function(){\n" + testcase.afterEach + "\n});";
      fileContents += "\nit('example: " + testcase.testName + "', function(done){\n";
      fileContents += '\ninjectExample(\n' + escapeExample(testcase.example) +'\n).then(function(helper){\n';
      fileContents += "\n" + testcase.assertion;
      fileContents += "\ndone();";
      fileContents += "\n});"; // end promise
      fileContents += "\n});"; // end it
      fileContents += "\n});"; // end describe
    });

    fileContents += '});';
    fs.writeFileSync(filepath, fileContents);
  }

  function isValidExample(doc){
    if(doc.examples && doc.examples.length === 1 && doc.customTags) {
      return doc.customTags.filter(tag => {
        return (tag.tag === 'assert' && tag.value.length > 0);
      }).length === 1;
    }
    return false;
  }

  function getTag(name, tags){
     var filtered = tags.filter(tag => { return tag.tag === name; });
     if(filtered.length === 1) {
      return filtered[0].value;
     }
     return false;
  }

  return function (done) {
    var testCases = [];
    var _ = require('lodash');
    var parsedDoco = '';
    var stream = parse({src: 'src/host/modules/*.js'});
    stream.on('data', function(data) {
      parsedDoco += data;
          
    });
    stream.on('end', function(){
      var jsonDoco = JSON.parse(parsedDoco);
      jsonDoco.filter(isValidExample).forEach(function(doco){
        testCases.push({
          testName: doco.id,
          example: doco.examples[0],
          beforeEach: getTag('beforeeach', doco.customTags),
          assertion: getTag('assert', doco.customTags),
          afterEach: getTag('afterEach', doco.customTags)
        });
        makeJasmineTests(testCases);
        runKarma({
          action: 'run'
        }, done);
      });
    });
  };
};