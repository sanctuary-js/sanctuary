'use strict';

var R = require('ramda');

var S = require('../..');

var Identity = require('./Identity');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
module.exports = function IdentityArb(arb) {
  return arb.smap(Identity, S.prop('value'), R.toString);
};
