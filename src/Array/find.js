
import { Just, Nothing } from '../Maybe'
import { a, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# find :: (a -> Boolean) -> Array a -> Maybe a
//.
//. Takes a predicate and an array and returns Just the leftmost element of
//. the array which satisfies the predicate; Nothing if none of the array's
//. elements satisfies the predicate.
//.
//. ```javascript
//. > S.find(n => n < 0, [1, -2, 3, -4, 5])
//. Just(-2)
//.
//. > S.find(n => n < 0, [1, 2, 3, 4, 5])
//. Nothing
//. ```
export const find =
def('find',
    {},
    [$.Function, $.Array(a), $Maybe(a)],
    function(pred, xs) {
      for (var idx = 0, len = xs.length; idx < len; idx += 1) {
        if (pred(xs[idx])) {
          return Just(xs[idx]);
        }
      }
      return Nothing;
    });
