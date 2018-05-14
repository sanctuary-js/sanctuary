'use strict';

var jsc = require ('jsverify');

var S = require ('./sanctuary');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
module.exports = function MaybeArb(arb) {
  return jsc.oneof (arb.smap (S.Just, S.prop ('value'), S.show),
                    jsc.constant (S.Nothing));
};
