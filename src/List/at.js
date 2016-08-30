
import { $Maybe, List } from '../_internal/Types'
import { a, def } from '../_internal'
import $ from 'sanctuary-def'
import R from 'ramda'
import { slice } from './slice'

//# at :: Integer -> [a] -> Maybe a
//.
//. Takes an index and a list and returns Just the element of the list at
//. the index if the index is within the list's bounds; Nothing otherwise.
//. A negative index represents an offset from the length of the list.
//.
//. ```javascript
//. > S.at(2, ['a', 'b', 'c', 'd', 'e'])
//. Just('c')
//.
//. > S.at(5, ['a', 'b', 'c', 'd', 'e'])
//. Nothing
//.
//. > S.at(-2, ['a', 'b', 'c', 'd', 'e'])
//. Just('d')
//. ```
export const at =
def('at',
    {},
    [$.Integer, List(a), $Maybe(a)],
    function(n, xs) {
      return R.map(R.head, slice(n, n === -1 ? -0 : n + 1, xs));
    });
