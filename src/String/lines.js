
import $ from 'sanctuary-def'
import R from 'ramda'
import { compose } from '../Composition'
import { def } from '../_internal'

//# lines :: String -> Array String
//.
//. Takes a string and returns the array of lines the string contains
//. (lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
//. The resulting strings do not contain newlines.
//.
//. See also [`unlines`](#unlines).
//.
//. ```javascript
//. > S.lines('foo\nbar\nbaz\n')
//. ['foo', 'bar', 'baz']
//. ```
export const lines =
def('lines',
    {},
    [$.String, $.Array($.String)],
    compose(R.match(/^(?=[\s\S]).*/gm), R.replace(/\r\n?/g, '\n')));
