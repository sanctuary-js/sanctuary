
import { $Maybe, List } from '../_internal/Types'
import { a, def } from '../_internal'
import { slice } from './slice'

//# init :: [a] -> Maybe [a]
//.
//. Takes a list and returns Just a list containing all but the last
//. of the list's elements if the list contains at least one element;
//. Nothing if the list is empty.
//.
//. ```javascript
//. > S.init([1, 2, 3])
//. Just([1, 2])
//.
//. > S.init([])
//. Nothing
//. ```
export const init =
def('init',
    {},
    [List(a), $Maybe(List(a))],
    slice(0, -1));
