
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { fromMaybe } from './fromMaybe'

//# maybe :: b -> (a -> b) -> Maybe a -> b
//.
//. Takes a value of any type, a function, and a Maybe. If the Maybe is
//. a Just, the return value is the result of applying the function to
//. the Just's value. Otherwise, the first argument is returned.
//.
//. ```javascript
//. > S.maybe(0, R.length, S.Just('refuge'))
//. 6
//.
//. > S.maybe(0, R.length, S.Nothing)
//. 0
//. ```
export const maybe =
def('maybe',
    {},
    [b, $.Function, $Maybe(a), b],
    function(x, f, maybe) { return fromMaybe(x, maybe.map(f)); });
