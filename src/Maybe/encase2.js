
import { Just, Nothing } from './Maybe'
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# encase2 :: (a -> b -> c) -> a -> b -> Maybe c
//.
//. Binary version of [`encase`](#encase).
//.
//. See also [`encase2_`](#encase2_).
export const encase2 =
def('encase2',
    {},
    [$.Function, a, b, $Maybe(c)],
    function(f, x, y) {
      try {
        return Just(f(x)(y));
      } catch (err) {
        return Nothing;
      }
    });
