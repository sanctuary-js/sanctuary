
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# test :: RegExp -> String -> Boolean
//.
//. Takes a pattern and a string, and returns `true` if the pattern
//. matches the string; `false` otherwise.
//.
//. ```javascript
//. > S.test(/^a/, 'abacus')
//. true
//.
//. > S.test(/^a/, 'banana')
//. false
//. ```
export const test =
def('test',
    {},
    [$.RegExp, $.String, $.Boolean],
    function(pattern, s) {
      var lastIndex = pattern.lastIndex;
      var result = pattern.test(s);
      pattern.lastIndex = lastIndex;
      return result;
    });
