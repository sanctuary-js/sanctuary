
import $ from 'sanctuary-def'
import { def } from '../_internal'

//# unwords :: Array String -> String
//.
//. Takes an array of words and returns the result of joining the words
//. with separating spaces.
//.
//. See also [`words`](#words).
//.
//. ```javascript
//. > S.unwords(['foo', 'bar', 'baz'])
//. 'foo bar baz'
//. ```
export const unwords =
def('unwords',
    {},
    [$.Array($.String), $.String],
    function(xs) { return xs.join(' '); });
