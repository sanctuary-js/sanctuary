'use strict';

var $ = require('sanctuary-def');

var eq = require('../utils').eq;
var S = require('../..');


describe('MaybeType', function() {

  it('has its type definition exported', function() {
    eq($.test($.env, S.MaybeType($.Number), S.Nothing), true);
    eq($.test($.env, S.MaybeType($.Number), S.Just(42)), true);
    eq($.test($.env, S.MaybeType($.Number), S.Just('42')), false);
    eq($.test($.env, S.MaybeType($.Number), S.Right(42)), false);
    eq($.test($.env, S.MaybeType($.Number), null), false);
  });

});
