
import { a, c, compose3, def } from '../_internal'
import $ from 'sanctuary-def'

//# B :: (b -> c) -> (a -> b) -> a -> c
//.
//. The B combinator. Takes two functions and a value, and returns the
//. result of applying the first function to the result of applying the
//. second to the value. Equivalent to [`compose`](#compose) and Haskell's
//. `(.)` function.
//.
//. ```javascript
//. > S.B(Math.sqrt, S.inc, 99)
//. 10
//. ```
export const B =
def('B',
    {},
    [$.Function, $.Function, a, c],
    compose3);
