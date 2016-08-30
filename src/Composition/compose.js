
import R from 'ramda'
import $ from 'sanctuary-def'
import { a, c, def, compose3 } from '../_internal'

//# compose :: (b -> c) -> (a -> b) -> a -> c
//.
//. Takes two functions assumed to be unary and a value of any type,
//. and returns the result of applying the first function to the result
//. of applying the second function to the given value.
//.
//. In general terms, `compose` performs right-to-left composition of two
//. unary functions.
//.
//. See also [`B`](#B) and [`pipe`](#pipe).
//.
//. ```javascript
//. > S.compose(Math.sqrt, S.inc)(99)
//. 10
//. ```
export const compose =
def('compose',
    {},
    [$.Function, $.Function, a, c],
    compose3);
