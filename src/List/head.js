
import { $Maybe, List } from '../_internal/Types'
import { a, def } from '../_internal'
import { at } from './at'

//# head :: [a] -> Maybe a
//.
//. Takes a list and returns Just the first element of the list if the
//. list contains at least one element; Nothing if the list is empty.
//.
//. ```javascript
//. > S.head([1, 2, 3])
//. Just(1)
//.
//. > S.head([])
//. Nothing
//. ```
export const head =
def('head',
    {},
    [List(a), $Maybe(a)],
    at(0));
