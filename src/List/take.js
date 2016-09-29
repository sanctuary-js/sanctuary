
import { $Maybe, List } from '../_internal/Types'
import { a, def, negativeZero } from '../_internal'
import $ from 'sanctuary-def'
import { Nothing } from '../Maybe'
import { slice } from './slice'

//# take :: Integer -> [a] -> Maybe [a]
//.
//. Returns Just the first N elements of the given collection if N is
//. greater than or equal to zero and less than or equal to the length
//. of the collection; Nothing otherwise. Supports Array, String, and
//. any other collection type which provides a `slice` method.
//.
//. ```javascript
//. > S.take(2, ['a', 'b', 'c', 'd', 'e'])
//. Just(['a', 'b'])
//.
//. > S.take(4, 'abcdefg')
//. Just('abcd')
//.
//. > S.take(4, ['a', 'b', 'c'])
//. Nothing
//. ```
export const take =
def('take',
    {},
    [$.Integer, List(a), $Maybe(List(a))],
    function(n, xs) {
      return n < 0 || negativeZero(n) ? Nothing : slice(0, n, xs);
    });
