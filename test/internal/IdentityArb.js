'use strict';

var S = require ('./sanctuary');

var Identity = require ('./Identity');
var toString = require ('./toString');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
module.exports = function IdentityArb(arb) {
  return arb.smap (Identity, S.prop ('value'), toString);
};
