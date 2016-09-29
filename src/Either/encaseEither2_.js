
import { a, b, def, l, r } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'
import { encaseEither2 } from './encaseEither2'

//# encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r
//.
//. Version of [`encaseEither2`](#encaseEither2) accepting uncurried
//. functions.
export const encaseEither2_ =
def('encaseEither2_',
    {},
    [$.Function, $.Function, a, b, $Either(l, r)],
    function(f, g_, x, y) {
      var g = function(x) {
        return function(y) {
          return g_(x, y);
        };
      };
      return encaseEither2(f, g, x, y);
    });
