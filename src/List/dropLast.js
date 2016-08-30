
import { $Maybe, List } from '../_internal/Types'
import { a, def, negativeZero } from '../_internal'
import $ from 'sanctuary-def'
import { Nothing } from '../Maybe'
import { slice } from './slice'

//# dropLast :: Integer -> [a] -> Maybe [a]
//.
//. Returns Just all but the last N elements of the given collection
//. if N is greater than or equal to zero and less than or equal to the
//. length of the collection; Nothing otherwise. Supports Array, String,
//. and any other collection type which provides a `slice` method.
//.
//. ```javascript
//. > S.dropLast(2, ['a', 'b', 'c', 'd', 'e'])
//. Just(['a', 'b', 'c'])
//.
//. > S.dropLast(4, 'abcdefg')
//. Just('abc')
//.
//. > S.dropLast(4, 'abc')
//. Nothing
//. ```
export const dropLast =
def('dropLast',
    {},
    [$.Integer, List(a), $Maybe(List(a))],
    function(n, xs) {
      return n < 0 || negativeZero(n) ? Nothing : slice(0, -n, xs);
    });
