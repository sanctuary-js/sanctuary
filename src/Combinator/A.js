
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'

//# A :: (a -> b) -> a -> b
//.
//. The A combinator. Takes a function and a value, and returns the result
//. of applying the function to the value. Equivalent to Haskell's `($)`
//. function.
//.
//. ```javascript
//. > S.A(S.inc, 42)
//. 43
//.
//. > R.map(S.A(R.__, 100), [S.inc, Math.sqrt])
//. [101, 10]
//. ```
export const A =
def('A',
    {},
    [$.Function, a, b],
    function(f, x) { return f(x); });
