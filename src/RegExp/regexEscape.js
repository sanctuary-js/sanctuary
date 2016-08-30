
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# regexEscape :: String -> String
//.
//. Takes a string which may contain regular expression metacharacters,
//. and returns a string with those metacharacters escaped.
//.
//. Properties:
//.
//.   - `forall s :: String. S.test(S.regex('', S.regexEscape(s)), s) = true`
//.
//. ```javascript
//. > S.regexEscape('-=*{XYZ}*=-')
//. '\\-=\\*\\{XYZ\\}\\*=\\-'
//. ```
export const regexEscape =
def('regexEscape',
    {},
    [$.String, $.String],
    function(s) { return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); });
