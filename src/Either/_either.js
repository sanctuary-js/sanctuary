
import { a, b, c, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# either :: (a -> c) -> (b -> c) -> Either a b -> c
//.
//. Takes two functions and an Either, and returns the result of
//. applying the first function to the Left's value, if the Either
//. is a Left, or the result of applying the second function to the
//. Right's value, if the Either is a Right.
//.
//. ```javascript
//. > S.either(S.toUpper, R.toString, S.Left('Cannot divide by zero'))
//. 'CANNOT DIVIDE BY ZERO'
//.
//. > S.either(S.toUpper, R.toString, S.Right(42))
//. '42'
//. ```
export const either =
def('either',
    {},
    [$.Function, $.Function, $Either(a, b), c],
    function(l, r, either) {
      return either.isLeft ? l(either.value) : r(either.value);
    });
