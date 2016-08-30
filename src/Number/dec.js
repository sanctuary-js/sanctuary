
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# dec :: FiniteNumber -> FiniteNumber
//.
//. Decrements a (finite) number by one.
//.
//. ```javascript
//. > S.dec(2)
//. 1
//. ```
export const dec =
def('dec',
    {},
    [$.FiniteNumber, $.FiniteNumber],
    function(a) { return a - 1; });
