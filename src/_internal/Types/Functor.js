
import $ from 'sanctuary-def'
import R from 'ramda'
import { _type } from '../_type'
import { hasMethod } from '../hasMethod'

//  Functor :: TypeClass
export const Functor = $.TypeClass(
  'sanctuary/Functor',
  function(x) {
    return R.contains(_type(x), ['Array', 'Function']) ||
           hasMethod('map')(x);
  }
);
