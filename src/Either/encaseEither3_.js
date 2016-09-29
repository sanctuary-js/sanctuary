
import { a, b, c, def, l, r } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'
import { encaseEither3 } from './encaseEither3'

//# encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r
//.
//. Version of [`encaseEither3`](#encaseEither3) accepting uncurried
//. functions.
export const encaseEither3_ =
def('encaseEither3',
    {},
    [$.Function, $.Function, a, b, c, $Either(l, r)],
    function(f, g_, x, y, z) {
      var g = function(x) {
        return function(y) {
          return function(z) {
            return g_(x, y, z);
          };
        };
      };
      return encaseEither3(f, g, x, y, z);
    });
