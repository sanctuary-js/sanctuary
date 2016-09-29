
import { def, f } from '../_internal'
import $ from 'sanctuary-def'
import { Foldable } from '../_internal/Types'
import { reduce } from '../Array'

//# sum :: Foldable f => f FiniteNumber -> FiniteNumber
//.
//. Returns the sum of the given array of (finite) numbers.
//.
//. ```javascript
//. > S.sum([1, 2, 3, 4, 5])
//. 15
//.
//. > S.sum([])
//. 0
//.
//. > S.sum(S.Just(42))
//. 42
//.
//. > S.sum(S.Nothing)
//. 0
//. ```
export const sum =
def('sum',
    {f: [Foldable]},
    [f, $.FiniteNumber],
    reduce(function(a) { return function(b) { return a + b; }; }, 0));
