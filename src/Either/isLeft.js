
import { a, b, def, prop } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# isLeft :: Either a b -> Boolean
//.
//. Returns `true` if the given Either is a Left; `false` if it is a Right.
//.
//. ```javascript
//. > S.isLeft(S.Left('Cannot divide by zero'))
//. true
//.
//. > S.isLeft(S.Right(42))
//. false
//. ```
export const isLeft =
def('isLeft',
    {},
    [$Either(a, b), $.Boolean],
    prop('isLeft'));
