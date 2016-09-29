
import { a, def, prop } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# isNothing :: Maybe a -> Boolean
//.
//. Returns `true` if the given Maybe is Nothing; `false` if it is a Just.
//.
//. ```javascript
//. > S.isNothing(S.Nothing)
//. true
//.
//. > S.isNothing(S.Just(42))
//. false
//. ```
export const isNothing =
def('isNothing',
    {},
    [$Maybe(a), $.Boolean],
    prop('isNothing'));
