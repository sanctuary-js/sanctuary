
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# negate :: ValidNumber -> ValidNumber
//.
//. Negates its argument.
//.
//. ```javascript
//. > S.negate(12.5)
//. -12.5
//.
//. > S.negate(-42)
//. 42
//. ```
export const negate =
def('negate',
    {},
    [$.ValidNumber, $.ValidNumber],
    function(n) { return -n; });
