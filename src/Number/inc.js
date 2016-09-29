
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# inc :: FiniteNumber -> FiniteNumber
//.
//. Increments a (finite) number by one.
//.
//. ```javascript
//. > S.inc(1)
//. 2
//. ```
export const inc =
def('inc',
    {},
    [$.FiniteNumber, $.FiniteNumber],
    function(a) { return a + 1; });
