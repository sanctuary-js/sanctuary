
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# keys :: StrMap a -> Array String
//.
//. Returns the keys of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.keys({b: 2, c: 3, a: 1}).sort()
//. ['a', 'b', 'c']
//. ```
export const keys =
def('keys',
    {},
    [$.StrMap(a), $.Array($.String)],
    Object.keys);
