
import $ from 'sanctuary-def'
import R from 'ramda'

//  Ord :: TypeClass
export const Ord = $.TypeClass(
  'sanctuary/Ord',
  R.anyPass([$.String._test, $.ValidDate._test, $.ValidNumber._test])
);
