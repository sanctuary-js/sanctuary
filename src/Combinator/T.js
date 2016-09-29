
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'

//# T :: a -> (a -> b) -> b
//.
//. The T ([thrush][]) combinator. Takes a value and a function, and returns
//. the result of applying the function to the value. Equivalent to Haskell's
//. `(&)` function.
//.
//. ```javascript
//. > S.T(42, S.inc)
//. 43
//.
//. > R.map(S.T(100), [S.inc, Math.sqrt])
//. [101, 10]
//. ```
export const T =
def('T',
    {},
    [a, $.Function, b],
    function(x, f) { return f(x); });
