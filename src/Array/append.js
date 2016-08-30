
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# append :: a -> Array a -> Array a
//.
//. Takes a value of any type and an array of values of that type, and
//. returns the result of appending the value to the array.
//.
//. See also [`prepend`](#prepend).
//.
//. ```javascript
//. > S.append(3, [1, 2])
//. [1, 2, 3]
//. ```
export const append =
def('append',
    {},
    [a, $.Array(a), $.Array(a)],
    function(x, xs) { return xs.concat([x]); });
