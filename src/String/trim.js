
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# trim :: String -> String
//.
//. Strips leading and trailing whitespace characters.
//.
//. ```javascript
//. > S.trim('\t\t foo bar \n')
//. 'foo bar'
//. ```
export const trim =
def('trim',
    {},
    [$.String, $.String],
    function(s) { return s.trim(); });
