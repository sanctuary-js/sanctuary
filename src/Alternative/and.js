
import { a, def } from '../_internal'
import { Alternative } from '../_internal/Types'
import { toBoolean } from './toBoolean'

//# and :: Alternative a => a -> a -> a
//.
//. Takes two values of the same type and returns the second value
//. if the first is "true"; the first value otherwise. An array is
//. considered "true" if its length is greater than zero. The Boolean
//. value `true` is also considered "true". Other types must provide
//. a `toBoolean` method.
//.
//. ```javascript
//. > S.and(S.Just(1), S.Just(2))
//. Just(2)
//.
//. > S.and(S.Nothing, S.Just(3))
//. Nothing
//. ```
export const and =
def('and',
    {a: [Alternative]},
    [a, a, a],
    function(x, y) { return toBoolean(x) ? y : x; });
