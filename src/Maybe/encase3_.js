
import { a, b, c, d, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { encase3 } from './encase3'

//# encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d
//.
//. Version of [`encase3`](#encase3) accepting uncurried functions.
export const encase3_ =
def('encase3_',
    {},
    [$.Function, a, b, c, $Maybe(d)],
    function(f_, x, y, z) {
      var f = function(x) {
        return function(y) {
          return function(z) {
            return f_(x, y, z);
          };
        };
      };
      return encase3(f, x, y, z);
    });
