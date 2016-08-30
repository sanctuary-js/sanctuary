
import { $Maybe, List } from '../_internal/Types'
import { a, def } from '../_internal'
import { at } from './at'

//# last :: [a] -> Maybe a
//.
//. Takes a list and returns Just the last element of the list if the
//. list contains at least one element; Nothing if the list is empty.
//.
//. ```javascript
//. > S.last([1, 2, 3])
//. Just(3)
//.
//. > S.last([])
//. Nothing
//. ```
export const last =
def('last',
    {},
    [List(a), $Maybe(a)],
    at(-1));
