
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# pairs :: StrMap a -> Array (Pair String a)
//.
//. Returns the key–value pairs of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.pairs({b: 2, a: 1, c: 3}).sort()
//. [['a', 1], ['b', 2], ['c', 3]]
//. ```
export const pairs =
def('pairs',
    {},
    [$.StrMap(a), $.Array($.Pair($.String, a))],
    function(strMap) {
      return Object.keys(strMap).map(function(k) { return [k, strMap[k]]; });
    });
