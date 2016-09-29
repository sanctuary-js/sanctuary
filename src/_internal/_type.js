
import R from 'ramda'

//  _type :: a -> String
export const _type = function(x) {
  return x != null && R.type(x['@@type']) === 'String' ? x['@@type']
                                                       : R.type(x);
};
