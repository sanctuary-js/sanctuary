const jsc = require('jsverify');

const S = require('./sanctuary');

const toString = require('./toString');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
export default function MaybeArb(arb: any): any {
  return jsc.oneof(arb.smap(S.Just, S.prop('value'), toString),
                   jsc.constant(S.Nothing));
}
