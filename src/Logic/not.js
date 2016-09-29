
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# not :: Boolean -> Boolean
//.
//. Takes a Boolean and returns the negation of that value
//. (`false` for `true`; `true` for `false`).
//.
//. ```javascript
//. > S.not(true)
//. false
//.
//. > S.not(false)
//. true
//. ```
export const not =
def('not',
    {},
    [$.Boolean, $.Boolean],
    function(x) { return !x.valueOf(); });
