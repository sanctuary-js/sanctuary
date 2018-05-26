'use strict';

var Identity = require ('sanctuary-identity');

var S = require ('./sanctuary');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
module.exports = function IdentityArb(arb) {
  return arb.smap (Identity, S.prop ('value'), S.show);
};
