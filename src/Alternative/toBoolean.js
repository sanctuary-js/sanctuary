
import R from 'ramda'

//  toBoolean :: Alternative a => a -> Boolean
export const toBoolean = function(x) {
  switch (R.type(x)) {
    case 'Array':     return x.length > 0;
    case 'Boolean':   return x.valueOf();
    default:          return x.toBoolean();
  }
};
