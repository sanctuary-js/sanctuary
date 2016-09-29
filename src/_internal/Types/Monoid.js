
import $ from 'sanctuary-def'
import R from 'ramda'
import { _type } from '../_type'
import { hasMethod } from '../hasMethod'

//  Monoid :: TypeClass
export const Monoid = $.TypeClass(
  'sanctuary/Monoid',
  function(x) {
    return R.contains(_type(x), ['Array', 'Boolean', 'Object', 'String']) ||
           hasMethod('empty')(x);
  }
);
