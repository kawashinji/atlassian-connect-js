import InsertionDetection from 'src/common/insertion_detection';

describe('InsertionDetection', () => {

  it('only create one style block for each identifier', () => {
    var el1 = InsertionDetection.createDetectionCssStyle('test');
    var el2 = InsertionDetection.createDetectionCssStyle('test');
    expect(el1).toBe(el2);
  });

  it('detects DOM insertion once', (done) => {
    var elementToInsert = document.createElement('div');
    elementToInsert.className = 'test';

    InsertionDetection.onceElementInserted(elementToInsert, 'test', function (element) {
      expect(element).toBe(elementToInsert);
      done();
    });
    document.body.appendChild(elementToInsert);
    document.body.appendChild(elementToInsert);
    document.body.appendChild(elementToInsert);
  });

  it('detects DOM insertion of multiple elements', (done) => {
    var expected = [];
    for (var i = 0; i < 5; i++) {
      var element = document.createElement('div');
      element.className = 'test';
      expected.push(element);
    }

    var detected = [];
    InsertionDetection.onInserted('test', function (element) {
      detected.push(element);
      if (detected.length === expected.length) {
        expect(detected).toEqual(expected);
        done();
      }
    });

    for (i = 0; i < 5; i++) {
      document.body.appendChild(expected[i]);
    }
  });

});
