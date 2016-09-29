
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { encase2 } from './encase2'

//# encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c
//.
//. Version of [`encase2`](#encase2) accepting uncurried functions.
export const encase2_ =
def('encase2_',
    {},
    [$.Function, a, b, $Maybe(c)],
    function(f_, x, y) {
      var f = function(x) {
        return function(y) {
          return f_(x, y);
        };
      };
      return encase2(f, x, y);
    });
