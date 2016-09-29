
import $ from 'sanctuary-def'
import R from 'ramda'
import { compose } from '../Composition'
import { concat } from '../List'
import { def } from '../_internal'

var _ = R.__;

//# unlines :: Array String -> String
//.
//. Takes an array of lines and returns the result of joining the lines
//. after appending a terminating line feed (`'\n'`) to each.
//.
//. See also [`lines`](#lines).
//.
//. ```javascript
//. > S.unlines(['foo', 'bar', 'baz'])
//. 'foo\nbar\nbaz\n'
//. ```
export const unlines =
def('unlines',
    {},
    [$.Array($.String), $.String],
    compose(R.join(''), R.map(concat(_, '\n'))));
