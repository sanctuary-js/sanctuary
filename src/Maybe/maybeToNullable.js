
import { a, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# maybeToNullable :: Maybe a -> Nullable a
//.
//. Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
//. [Nullable][] is defined in sanctuary-def.
//.
//. See also [`fromMaybe`](#fromMaybe).
//.
//. ```javascript
//. > S.maybeToNullable(S.Just(42))
//. 42
//.
//. > S.maybeToNullable(S.Nothing)
//. null
//. ```
export const maybeToNullable =
def('maybeToNullable',
    {},
    [$Maybe(a), $.Nullable(a)],
    function(maybe) { return maybe.isJust ? maybe.value : null; });
