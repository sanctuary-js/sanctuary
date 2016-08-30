
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# odd :: Integer -> Boolean
//.
//. Returns `true` if the given integer is odd; `false` if it is even.
//.
//. ```javascript
//. > S.odd(99)
//. true
//.
//. > S.odd(42)
//. false
//. ```
export const odd =
def('odd',
    {},
    [$.Integer, $.Boolean],
    function(n) { return n % 2 !== 0; });
