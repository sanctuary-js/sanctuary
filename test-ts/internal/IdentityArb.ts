const S = require('./sanctuary');

const Identity = require('./Identity');
const toString = require('./toString');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
export default function IdentityArb(arb: any): any {
  return arb.smap(Identity, S.prop('value'), toString);
}
