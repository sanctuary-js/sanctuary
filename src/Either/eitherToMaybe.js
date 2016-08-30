
import { $Either, $Maybe } from '../_internal/Types'
import { Just, Nothing } from '../Maybe'
import { a, b, def } from '../_internal'

//# eitherToMaybe :: Either a b -> Maybe b
//.
//. Converts an Either to a Maybe. A Left becomes Nothing; a Right becomes
//. a Just.
//.
//. See also [`maybeToEither`](#maybeToEither).
//.
//. ```javascript
//. > S.eitherToMaybe(S.Left('Cannot divide by zero'))
//. Nothing
//.
//. > S.eitherToMaybe(S.Right(42))
//. Just(42)
//. ```
export const eitherToMaybe =
def('eitherToMaybe',
    {},
    [$Either(a, b), $Maybe(b)],
    function(either) {
      return either.isLeft ? Nothing : Just(either.value);
    });
