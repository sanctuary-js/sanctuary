
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# even :: Integer -> Boolean
//.
//. Returns `true` if the given integer is even; `false` if it is odd.
//.
//. ```javascript
//. > S.even(42)
//. true
//.
//. > S.even(99)
//. false
//. ```
export const even =
def('even',
    {},
    [$.Integer, $.Boolean],
    function(n) { return n % 2 === 0; });
