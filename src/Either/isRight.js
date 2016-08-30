
import { a, b, def, prop } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# isRight :: Either a b -> Boolean
//.
//. Returns `true` if the given Either is a Right; `false` if it is a Left.
//.
//. ```javascript
//. > S.isRight(S.Right(42))
//. true
//.
//. > S.isRight(S.Left('Cannot divide by zero'))
//. false
//. ```
export const isRight =
def('isRight',
    {},
    [$Either(a, b), $.Boolean],
    prop('isRight'));
