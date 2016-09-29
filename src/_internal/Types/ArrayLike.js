
import $ from 'sanctuary-def'

//  ArrayLike :: TypeClass
export const ArrayLike = $.TypeClass(
  'ArrayLike',
  function(x) {
    return x != null &&
           typeof x !== 'function' &&
           $.Integer._test(x.length) &&
           x.length >= 0;
  }
);
