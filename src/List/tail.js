
import { $Maybe, List } from '../_internal/Types'
import { a, def } from '../_internal'
import { slice } from './slice'

//# tail :: [a] -> Maybe [a]
//.
//. Takes a list and returns Just a list containing all but the first
//. of the list's elements if the list contains at least one element;
//. Nothing if the list is empty.
//.
//. ```javascript
//. > S.tail([1, 2, 3])
//. Just([2, 3])
//.
//. > S.tail([])
//. Nothing
//. ```
export const tail =
def('tail',
    {},
    [List(a), $Maybe(List(a))],
    slice(1, -0));
