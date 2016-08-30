
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# mult :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Returns the product of two (finite) numbers.
//.
//. ```javascript
//. > S.mult(4, 2)
//. 8
//. ```
export const mult =
def('mult',
    {},
    [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    function(a, b) { return a * b; });
