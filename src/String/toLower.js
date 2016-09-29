
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# toLower :: String -> String
//.
//. Returns the lower-case equivalent of its argument.
//.
//. See also [`toUpper`](#toUpper).
//.
//. ```javascript
//. > S.toLower('ABC def 123')
//. 'abc def 123'
//. ```
export const toLower =
def('toLower',
    {},
    [$.String, $.String],
    function(s) { return s.toLowerCase(); });
