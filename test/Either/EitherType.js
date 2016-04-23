'use strict';

var $ = require('sanctuary-def');

var eq = require('../utils').eq;
var S = require('../..');


describe('EitherType', function() {

  it('has its type definition exported', function() {
    eq(S.EitherType($.String, $.Number).test(S.Left('Error')), true);
    eq(S.EitherType($.String, $.Number).test(S.Right(1)), true);
    eq(S.EitherType($.String, $.Number).test(1), false);
  });

});
