
import $ from 'sanctuary-def'
import R from 'ramda'

//  TypeRep :: Type
export const TypeRep = $.NullaryType(
  'sanctuary/TypeRep',
  function(x) {
    return R.type(x) === 'Function' ||
           (x != null &&
            R.type(x.name) === 'String' &&
            R.type(x.test) === 'Function');
  }
);
