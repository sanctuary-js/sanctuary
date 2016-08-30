
import { Just, Nothing } from './Maybe'
import { a, b, c, d, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
//.
//. Ternary version of [`encase`](#encase).
//.
//. See also [`encase3_`](#encase3_).
export const encase3 =
def('encase3',
    {},
    [$.Function, a, b, c, $Maybe(d)],
    function(f, x, y, z) {
      try {
        return Just(f(x)(y)(z));
      } catch (err) {
        return Nothing;
      }
    });
