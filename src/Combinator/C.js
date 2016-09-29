
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'

//# C :: (a -> b -> c) -> b -> a -> c
//.
//. The C combinator. Takes a curried binary function and two values, and
//. returns the result of applying the function to the values in reverse
//. order. Equivalent to Haskell's `flip` function.
//.
//. This function is very similar to [`flip`](#flip), except that its first
//. argument must be curried. This allows it to work with manually curried
//. functions.
//.
//. ```javascript
//. > S.C(S.concat, 'foo', 'bar')
//. 'barfoo'
//.
//. > R.filter(S.C(R.gt, 0), [-1, -2, 3, -4, 4, 2])
//. [3, 4, 2]
//. ```
export const C =
def('C',
    {},
    [$.Function, b, a, c],
    function(f, x, y) { return f(y)(x); });
