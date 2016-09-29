
import { $Maybe, List } from '../_internal/Types'
import { Just, Nothing } from '../Maybe'
import { a, def, negativeZero } from '../_internal'
import $ from 'sanctuary-def'
import R from 'ramda'

//# slice :: Integer -> Integer -> [a] -> Maybe [a]
//.
//. Returns Just a list containing the elements from the supplied list
//. from a beginning index (inclusive) to an end index (exclusive).
//. Returns Nothing unless the start interval is less than or equal to
//. the end interval, and the list contains both (half-open) intervals.
//. Accepts negative indices, which indicate an offset from the end of
//. the list.
//.
//. Dispatches to its third argument's `slice` method if present. As a
//. result, one may replace `[a]` with `String` in the type signature.
//.
//. ```javascript
//. > S.slice(1, 3, ['a', 'b', 'c', 'd', 'e'])
//. Just(['b', 'c'])
//.
//. > S.slice(-2, -0, ['a', 'b', 'c', 'd', 'e'])
//. Just(['d', 'e'])
//.
//. > S.slice(2, -0, ['a', 'b', 'c', 'd', 'e'])
//. Just(['c', 'd', 'e'])
//.
//. > S.slice(1, 6, ['a', 'b', 'c', 'd', 'e'])
//. Nothing
//.
//. > S.slice(2, 6, 'banana')
//. Just('nana')
//. ```
export const slice =
def('slice',
    {},
    [$.Integer, $.Integer, List(a), $Maybe(List(a))],
    function(start, end, xs) {
      var len = xs.length;
      var A = negativeZero(start) ? len : start < 0 ? start + len : start;
      var Z = negativeZero(end) ? len : end < 0 ? end + len : end;

      return Math.abs(start) <= len && Math.abs(end) <= len && A <= Z ?
        Just(R.slice(A, Z, xs)) :
        Nothing;
    });
