
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# prepend :: a -> Array a -> Array a
//.
//. Takes a value of any type and an array of values of that type, and
//. returns the result of prepending the value to the array.
//.
//. See also [`append`](#append).
//.
//. ```javascript
//. > S.prepend(1, [2, 3])
//. [1, 2, 3]
//. ```
export const prepend =
def('prepend',
    {},
    [a, $.Array(a), $.Array(a)],
    function(x, xs) { return [x].concat(xs); });
