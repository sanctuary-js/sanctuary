
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'
import { Apply } from '../_internal/Types'
import R from 'ramda'

//# lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
//.
//. Promotes a curried binary function to a function which operates on two
//. [Apply][]s.
//.
//. ```javascript
//. > S.lift2(S.add, S.Just(2), S.Just(3))
//. Just(5)
//.
//. > S.lift2(S.add, S.Just(2), S.Nothing)
//. Nothing
//.
//. > S.lift2(S.and, S.Just(true), S.Just(true))
//. Just(true)
//.
//. > S.lift2(S.and, S.Just(true), S.Just(false))
//. Just(false)
//. ```
export const lift2 =
def('lift2',
    {a: [Apply], b: [Apply], c: [Apply]},
    [$.Function, a, b, c],
    function(f, x, y) { return R.ap(R.map(f, x), y); });
