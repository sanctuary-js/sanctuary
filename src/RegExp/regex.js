
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# regex :: RegexFlags -> String -> RegExp
//.
//. Takes a [RegexFlags][] and a pattern, and returns a RegExp.
//.
//. ```javascript
//. > S.regex('g', ':\\d+:')
//. /:\d+:/g
//. ```
export const regex =
def('regex',
    {},
    [$.RegexFlags, $.String, $.RegExp],
    function(flags, source) { return new RegExp(source, flags); });
