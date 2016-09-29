
import $ from 'sanctuary-def'
import { hasMethod } from '../hasMethod'

//  Semigroup :: TypeClass
export const Semigroup = $.TypeClass(
  'sanctuary/Semigroup',
  hasMethod('concat')
);
