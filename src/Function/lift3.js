
import { a, b, c, d, def } from '../_internal'
import $ from 'sanctuary-def'
import { Apply } from '../_internal/Types'
import R from 'ramda'

//# lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
//.
//. Promotes a curried ternary function to a function which operates on three
//. [Apply][]s.
//.
//. ```javascript
//. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3]))
//. Just(6)
//.
//. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing)
//. Nothing
//. ```
export const lift3 =
def('lift3',
    {a: [Apply], b: [Apply], c: [Apply], d: [Apply]},
    [$.Function, a, b, c, d],
    function(f, x, y, z) { return R.ap(R.ap(R.map(f, x), y), z); });
