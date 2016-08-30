
import { $Maybe, List } from '../_internal/Types'
import { a, def, negativeZero } from '../_internal'
import $ from 'sanctuary-def'
import { Nothing } from '../Maybe'
import { slice } from './slice'

//# drop :: Integer -> [a] -> Maybe [a]
//.
//. Returns Just all but the first N elements of the given collection
//. if N is greater than or equal to zero and less than or equal to the
//. length of the collection; Nothing otherwise. Supports Array, String,
//. and any other collection type which provides a `slice` method.
//.
//. ```javascript
//. > S.drop(2, ['a', 'b', 'c', 'd', 'e'])
//. Just(['c', 'd', 'e'])
//.
//. > S.drop(4, 'abcdefg')
//. Just('efg')
//.
//. > S.drop(4, 'abc')
//. Nothing
//. ```
export const drop =
def('drop',
    {},
    [$.Integer, List(a), $Maybe(List(a))],
    function(n, xs) {
      return n < 0 || negativeZero(n) ? Nothing : slice(n, -0, xs);
    });
