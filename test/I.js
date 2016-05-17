'use strict';

var eq = require('./utils').eq;
var S = require('..');


describe('I', function() {

  it('is a unary function', function() {
    eq(typeof S.I, 'function');
    eq(S.I.length, 1);
  });

  it('returns its argument', function() {
    eq(S.I([1, 2, 3]), [1, 2, 3]);
    eq(S.I(['foo', 42]), ['foo', 42]);
    eq(S.I({'@@type': 'my-package/Foreign'}),
       {'@@type': 'my-package/Foreign'});
  });

});
