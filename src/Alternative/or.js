
import { a, def } from '../_internal'
import { Alternative } from '../_internal/Types'
import { toBoolean } from './toBoolean'

//# or :: Alternative a => a -> a -> a
//.
//. Takes two values of the same type and returns the first value if it
//. is "true"; the second value otherwise. An array is considered "true"
//. if its length is greater than zero. The Boolean value `true` is also
//. considered "true". Other types must provide a `toBoolean` method.
//.
//. ```javascript
//. > S.or(S.Just(1), S.Just(2))
//. Just(1)
//.
//. > S.or(S.Nothing, S.Just(3))
//. Just(3)
//. ```
export const or =
def('or',
    {a: [Alternative]},
    [a, a, a],
    function(x, y) { return toBoolean(x) ? x : y; });
