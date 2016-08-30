
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { Functor } from '../_internal/Types'
import R from 'ramda'

//# lift :: Functor f => (a -> b) -> f a -> f b
//.
//. Promotes a unary function to a function which operates on a [Functor][].
//.
//. ```javascript
//. > S.lift(S.inc, S.Just(2))
//. Just(3)
//.
//. > S.lift(S.inc, S.Nothing)
//. Nothing
//. ```
export const lift =
def('lift',
    {a: [Functor], b: [Functor]},
    [$.Function, a, b],
    R.map);
