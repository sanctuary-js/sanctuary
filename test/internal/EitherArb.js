'use strict';

var jsc = require ('jsverify');

var S = require ('./sanctuary');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
module.exports = function EitherArb(lArb, rArb) {
  return jsc.oneof (lArb.smap (S.Left, S.prop ('value'), S.show),
                    rArb.smap (S.Right, S.prop ('value'), S.show));
};
