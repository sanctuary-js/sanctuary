
import $ from 'sanctuary-def'
import R from 'ramda'
import { hasMethod } from '../hasMethod'

//  Alternative :: TypeClass
export const Alternative = $.TypeClass(
  'Alternative',
  function(x) {
    return R.contains(R.type(x), ['Array', 'Boolean']) ||
           hasMethod('toBoolean')(x);
  }
);
