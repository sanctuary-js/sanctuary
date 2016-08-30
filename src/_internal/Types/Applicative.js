
import $ from 'sanctuary-def'
import { Apply } from './Apply'
import { _type } from '../_type'
import { hasMethod } from '../hasMethod'

//  Applicative :: TypeClass
export const Applicative = $.TypeClass(
  'sanctuary/Applicative',
  function(x) {
    return _type(x) === 'Array' ||
           Apply._test(x) && (hasMethod('of')(x) ||
                              hasMethod('of')(x.constructor));
  }
);
