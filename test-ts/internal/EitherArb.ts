const jsc = require('jsverify');

const S = require('./sanctuary');

const toString = require('./toString');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
export default function EitherArb(lArb: any, rArb: any): any {
  return jsc.oneof(lArb.smap(S.Left, S.prop('value'), toString),
                   rArb.smap(S.Right, S.prop('value'), toString));
}
