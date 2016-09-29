
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# values :: StrMap a -> Array a
//.
//. Returns the values of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.values({a: 1, c: 3, b: 2}).sort()
//. [1, 2, 3]
//. ```
export const values =
def('values',
    {},
    [$.StrMap(a), $.Array(a)],
    function(strMap) {
      return Object.keys(strMap).map(function(key) { return strMap[key]; });
    });
