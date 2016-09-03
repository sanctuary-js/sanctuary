'use strict';

var S = require('..');

var eq = require('./internal/eq');
var properties = require('./properties');


describe('I', function() {

  it('is a unary function', function() {
    eq(typeof S.I, 'function');
    eq(S.I.length, 1);
  });

  it('returns its argument', function() {
    eq(S.I([1, 2, 3]), [1, 2, 3]);
    eq(S.I(['foo', 42]), ['foo', 42]);
    eq(S.I({'@@type': 'my-package/Foreign'}), {'@@type': 'my-package/Foreign'});
  });

  it('is idempotent', function() {
    eq(properties.idempotent(S.I), true);
  });

  it('is an involution', function() {
    eq(properties.involution(S.I), true);
  });

});
