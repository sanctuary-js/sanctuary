
import { $Maybe, Foldable } from '../_internal/Types'
import { Just, Nothing } from '../Maybe'
import { def, f } from '../_internal'
import $ from 'sanctuary-def'
import { reduce_ } from '../Array'

//# mean :: Foldable f => f FiniteNumber -> Maybe FiniteNumber
//.
//. Returns the mean of the given array of (finite) numbers.
//.
//. ```javascript
//. > S.mean([1, 2, 3, 4, 5])
//. S.Just(3)
//.
//. > S.mean([])
//. S.Nothing
//.
//. > S.mean(S.Just(42))
//. S.Just(42)
//.
//. > S.mean(S.Nothing)
//. S.Nothing
//. ```
export const mean =
def('mean',
    {f: [Foldable]},
    [f, $Maybe($.FiniteNumber)],
    function(foldable) {
      var result = reduce_(
        function(acc, n) {
          acc.total += n;
          acc.count += 1;
          return acc;
        },
        {total: 0, count: 0},
        foldable
      );
      return result.count === 0 ? Nothing
                                : Just(result.total / result.count);
    });
