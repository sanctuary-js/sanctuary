
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber
//.
//. Returns the result of dividing its first argument (a finite number) by
//. its second argument (a non-zero finite number).
//.
//. ```javascript
//. > S.div(7, 2)
//. 3.5
//. ```
export const div =
def('div',
    {},
    [$.FiniteNumber, $.NonZeroFiniteNumber, $.FiniteNumber],
    function(a, b) { return a / b; });
