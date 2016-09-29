
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# toUpper :: String -> String
//.
//. Returns the upper-case equivalent of its argument.
//.
//. See also [`toLower`](#toLower).
//.
//. ```javascript
//. > S.toUpper('ABC def 123')
//. 'ABC DEF 123'
//. ```
export const toUpper =
def('toUpper',
    {},
    [$.String, $.String],
    function(s) { return s.toUpperCase(); });
