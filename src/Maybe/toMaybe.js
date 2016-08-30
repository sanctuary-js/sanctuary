
import { Just, Nothing } from './Maybe'
import { a, def } from '../_internal'
import { $Maybe } from '../_internal/Types'

//# toMaybe :: a? -> Maybe a
//.
//. Takes a value and returns Nothing if the value is null or undefined;
//. Just the value otherwise.
//.
//. ```javascript
//. > S.toMaybe(null)
//. Nothing
//.
//. > S.toMaybe(42)
//. Just(42)
//. ```
export const toMaybe =
def('toMaybe',
    {},
    [a, $Maybe(a)],
    function(x) { return x == null ? Nothing : Just(x); });
