
import { a, def, prop } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# isJust :: Maybe a -> Boolean
//.
//. Returns `true` if the given Maybe is a Just; `false` if it is Nothing.
//.
//. ```javascript
//. > S.isJust(S.Just(42))
//. true
//.
//. > S.isJust(S.Nothing)
//. false
//. ```
export const isJust =
def('isJust',
    {},
    [$Maybe(a), $.Boolean],
    prop('isJust'));
