
import { a, c, def } from '../_internal'
import $ from 'sanctuary-def'

//# S :: (a -> b -> c) -> (a -> b) -> a -> c
//.
//. The S combinator. Takes a curried binary function, a unary function,
//. and a value, and returns the result of applying the binary function to:
//.
//.   - the value; and
//.   - the result of applying the unary function to the value.
//.
//. ```javascript
//. > S.S(S.add, Math.sqrt, 100)
//. 110
//. ```
export const S =
def('S',
    {},
    [$.Function, $.Function, a, c],
    function(f, g, x) { return f(x)(g(x)); });
