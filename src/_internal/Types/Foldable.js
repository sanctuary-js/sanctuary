
import $ from 'sanctuary-def'
import { _type } from '../_type'
import { hasMethod } from '../hasMethod'

//  Foldable :: TypeClass
export const Foldable = $.TypeClass(
  'sanctuary/Foldable',
  function(x) {
    return _type(x) === 'Array' || hasMethod('reduce')(x);
  }
);
