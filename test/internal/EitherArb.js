'use strict';

var jsc = require ('jsverify');

var S = require ('./sanctuary');

var toString = require ('./toString');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
module.exports = function EitherArb(lArb, rArb) {
  return jsc.oneof (lArb.smap (S.Left, S.prop ('value'), toString),
                    rArb.smap (S.Right, S.prop ('value'), toString));
};
