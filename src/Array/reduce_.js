
import { _type, a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { Foldable } from '../_internal/Types'

//# reduce_ :: Foldable f => ((a, b) -> a) -> a -> f b -> a
//.
//. Version of [`reduce`](#reduce) accepting uncurried functions.
export const reduce_ =
def('reduce_',
    {b: [Foldable]},
    [$.Function, a, b, a],
    function(f, initial, foldable) {
      if (_type(foldable) === 'Array') {
        var acc = initial;
        for (var idx = 0; idx < foldable.length; idx += 1) {
          acc = f(acc, foldable[idx]);
        }
        return acc;
      } else {
        return foldable.reduce(f, initial);
      }
    });
