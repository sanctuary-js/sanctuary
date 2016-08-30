
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'

//# ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b
//.
//. Takes a unary predicate, a unary "if" function, a unary "else"
//. function, and a value of any type, and returns the result of
//. applying the "if" function to the value if the value satisfies
//. the predicate; the result of applying the "else" function to the
//. value otherwise.
//.
//. ```javascript
//. > S.ifElse(x => x < 0, Math.abs, Math.sqrt, -1)
//. 1
//.
//. > S.ifElse(x => x < 0, Math.abs, Math.sqrt, 16)
//. 4
//. ```
export const ifElse =
def('ifElse',
    {},
    [$.Function, $.Function, $.Function, a, b],
    function(pred, f, g, x) { return pred(x) ? f(x) : g(x); });
