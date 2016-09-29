
import { $Maybe, List } from '../_internal/Types'
import { a, def, negativeZero } from '../_internal'
import $ from 'sanctuary-def'
import { Nothing } from '../Maybe'
import { slice } from './slice'

//# takeLast :: Integer -> [a] -> Maybe [a]
//.
//. Returns Just the last N elements of the given collection if N is
//. greater than or equal to zero and less than or equal to the length
//. of the collection; Nothing otherwise. Supports Array, String, and
//. any other collection type which provides a `slice` method.
//.
//. ```javascript
//. > S.takeLast(2, ['a', 'b', 'c', 'd', 'e'])
//. Just(['d', 'e'])
//.
//. > S.takeLast(4, 'abcdefg')
//. Just('defg')
//.
//. > S.takeLast(4, ['a', 'b', 'c'])
//. Nothing
//. ```
export const takeLast =
def('takeLast',
    {},
    [$.Integer, List(a), $Maybe(List(a))],
    function(n, xs) {
      return n < 0 || negativeZero(n) ? Nothing : slice(-n, -0, xs);
    });
