
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# add :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Returns the sum of two (finite) numbers.
//.
//. ```javascript
//. > S.add(1, 1)
//. 2
//. ```
export const add =
def('add',
    {},
    [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    function(a, b) { return a + b; });
