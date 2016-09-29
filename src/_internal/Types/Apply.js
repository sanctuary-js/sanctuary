
import $ from 'sanctuary-def'
import { Functor } from './Functor'
import R from 'ramda'
import { _type } from '../_type'
import { hasMethod } from '../hasMethod'

//  Apply :: TypeClass
export const Apply = $.TypeClass(
  'sanctuary/Apply',
  function(x) {
    return R.contains(_type(x), ['Array', 'Function']) ||
           Functor._test(x) && hasMethod('ap')(x);
  }
);
