
import { def, f } from '../_internal'
import $ from 'sanctuary-def'
import { Foldable } from '../_internal/Types'
import { reduce } from '../Array'

//# product :: Foldable f => f FiniteNumber -> FiniteNumber
//.
//. Returns the product of the given array of (finite) numbers.
//.
//. ```javascript
//. > S.product([1, 2, 3, 4, 5])
//. 120
//.
//. > S.product([])
//. 1
//.
//. > S.product(S.Just(42))
//. 42
//.
//. > S.product(S.Nothing)
//. 1
//. ```
export const product =
def('product',
    {f: [Foldable]},
    [f, $.FiniteNumber],
    reduce(function(a) { return function(b) { return a * b; }; }, 1));
