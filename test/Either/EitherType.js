'use strict';

var $ = require('sanctuary-def');

var S = require('../..');

var eq = require('../internal/eq');


describe('EitherType', function() {

  it('has its type definition exported', function() {
    eq($.test($.env, S.EitherType($.String, $.Number), S.Left('Error')), true);
    eq($.test($.env, S.EitherType($.String, $.Number), S.Right(42)), true);
    eq($.test($.env, S.EitherType($.String, $.Number), S.Right('42')), false);
    eq($.test($.env, S.EitherType($.String, $.Number), S.Just(42)), false);
    eq($.test($.env, S.EitherType($.String, $.Number), null), false);
  });

});
