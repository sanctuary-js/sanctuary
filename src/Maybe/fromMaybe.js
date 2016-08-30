
import { a, def } from '../_internal'
import { $Maybe } from '../_internal/Types'

//# fromMaybe :: a -> Maybe a -> a
//.
//. Takes a default value and a Maybe, and returns the Maybe's value
//. if the Maybe is a Just; the default value otherwise.
//.
//. See also [`maybeToNullable`](#maybeToNullable).
//.
//. ```javascript
//. > S.fromMaybe(0, S.Just(42))
//. 42
//.
//. > S.fromMaybe(0, S.Nothing)
//. 0
//. ```
export const fromMaybe =
def('fromMaybe',
    {},
    [a, $Maybe(a), a],
    function(x, maybe) { return maybe.isJust ? maybe.value : x; });
