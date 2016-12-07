'use strict';

var jsc = require('jsverify');
var R = require('ramda');

var S = require('../..');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
module.exports = function EitherArb(lArb, rArb) {
  return jsc.oneof(lArb.smap(S.Left, S.prop('value'), R.toString),
                   rArb.smap(S.Right, S.prop('value'), R.toString));
};
