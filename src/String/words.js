
import $ from 'sanctuary-def'
import R from 'ramda'
import { def } from '../_internal'
import { compose } from '../Composition'

//# words :: String -> Array String
//.
//. Takes a string and returns the array of words the string contains
//. (words are delimited by whitespace characters).
//.
//. See also [`unwords`](#unwords).
//.
//. ```javascript
//. > S.words(' foo bar baz ')
//. ['foo', 'bar', 'baz']
//. ```
export const words =
def('words',
    {},
    [$.String, $.Array($.String)],
    compose(R.reject(R.isEmpty), R.split(/\s+/)));
