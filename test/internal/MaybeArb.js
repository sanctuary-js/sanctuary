'use strict';

var jsc = require('jsverify');
var R = require('ramda');

var S = require('../..');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
module.exports = function MaybeArb(arb) {
  return jsc.oneof(arb.smap(S.Just, S.prop('value'), R.toString),
                   jsc.constant(S.Nothing));
};
