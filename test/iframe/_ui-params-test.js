import uiParams from '../../src/common/ui-params'
import base64 from '../../src/common/base64'

QUnit.module('Ui Params', {
    setup: function(){
        this.paramObj = { foo: 'bar', a: "b" };
        this.encodedParamObj = base64.encode(JSON.stringify(this.paramObj));
    }
});

QUnit.test('when passed an object. Encode returns a base64 json string', function (assert) {
    assert.equal(uiParams.encode(this.paramObj), this.encodedParamObj);
});

QUnit.test('decode returns an object when presented with a base64 encoded json blob', function (assert) {
    var decoded = uiParams.decode(this.encodedParamObj);
    assert.deepEqual(decoded, this.paramObj);
});

QUnit.test("decoding an invalid set of options returns a blank object", function(assert){
    var invalid = this.encodedParamObj + 'a!bc';
    assert.deepEqual(uiParams.decode(invalid), {});
});

QUnit.test("decoding an encoded object returns the original", function(assert){
    var encoded = uiParams.encode(this.paramObj);
    var decoded = uiParams.decode(encoded);
    assert.deepEqual(this.paramObj, decoded);
});


QUnit.test('fromUrl returns the param object from a url', function(assert) {
    var remoteUrl = 'http://www.example.com?a=jira:12345&ui-params=' + this.encodedParamObj;
    assert.deepEqual(uiParams.fromUrl(remoteUrl), this.paramObj);
});
