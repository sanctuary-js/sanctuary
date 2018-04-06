'use strict';

var jsc = require ('jsverify');

var S = require ('./sanctuary');

var toString = require ('./toString');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
module.exports = function MaybeArb(arb) {
  return jsc.oneof (arb.smap (S.Just, S.prop ('value'), toString),
                    jsc.constant (S.Nothing));
};
