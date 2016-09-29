
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'

//# flip :: ((a, b) -> c) -> b -> a -> c
//.
//. Takes a binary function and two values, and returns the result of
//. applying the function to the values in reverse order.
//.
//. See also [`C`](#C).
//.
//. ```javascript
//. > R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5])
//. [1, 4, 9, 16, 25]
//. ```
export const flip =
def('flip',
    {},
    [$.Function, b, a, c],
    function(f, x, y) { return f(y, x); });
