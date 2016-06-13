'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('./sanctuary');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
module.exports = function EitherArb(lArb, rArb) {
  return jsc.oneof(lArb.smap(S.Left, S.prop('value'), Z.toString),
                   rArb.smap(S.Right, S.prop('value'), Z.toString));
};
