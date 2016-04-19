'use strict';

var R = require('ramda');

var eq = require('./utils').eq;
var S = require('..');

describe('unchecked', function() {

  it('has the same properties as the top-level module', function() {
    eq(R.sortBy(S.I, R.keys(S.unchecked)),
       R.sortBy(S.I, R.without(['unchecked'], R.keys(S))));
  });

  it('provides functions which do not perform type checking', function() {
    eq(S.unchecked.inc(42), S.inc(42));
    eq(S.unchecked.inc('XXX'), 'XXX1');
  });

});
