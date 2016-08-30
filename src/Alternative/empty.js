
import R from 'ramda'

//  empty :: Monoid a => a -> a
export const empty = function(x) {
  switch (R.type(x)) {
    case 'Array':     return [];
    case 'Boolean':   return false;
    default:          return x.empty();
  }
};
