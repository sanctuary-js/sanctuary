'use strict';

var $ = require('sanctuary-def');

var eq = require('../utils').eq;
var S = require('../..');


describe('MaybeType', function() {

  it('has its type definition exported', function() {
    eq(S.MaybeType($.Number).test(S.Nothing()), true);
    eq(S.MaybeType($.Number).test(S.Just(1)), true);
    eq(S.MaybeType($.Number).test('abc'), false);
  });

});
