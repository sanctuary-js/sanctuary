
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Returns the difference between two (finite) numbers.
//.
//. ```javascript
//. > S.sub(4, 2)
//. 2
//. ```
export const sub =
def('sub',
    {},
    [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    function(a, b) { return a - b; });
