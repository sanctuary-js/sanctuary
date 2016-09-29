
import { Alternative, Monoid } from '../_internal/Types'
import { a, def } from '../_internal'
import { empty } from './empty'
import { or } from './or'
import { toBoolean } from './toBoolean'

//# xor :: (Alternative a, Monoid a) => a -> a -> a
//.
//. Takes two values of the same type and returns the "true" value
//. if one value is "true" and the other is "false"; otherwise it
//. returns the type's "false" value. An array is considered "true"
//. if its length is greater than zero. The Boolean value `true` is
//. also considered "true". Other types must provide `toBoolean` and
//. `empty` methods.
//.
//. ```javascript
//. > S.xor(S.Nothing, S.Just(1))
//. Just(1)
//.
//. > S.xor(S.Just(2), S.Just(3))
//. Nothing
//. ```
export const xor =
def('xor',
    {a: [Alternative, Monoid]},
    [a, a, a],
    function(x, y) {
      return toBoolean(x) === toBoolean(y) ? empty(x) : or(x, y);
    });
