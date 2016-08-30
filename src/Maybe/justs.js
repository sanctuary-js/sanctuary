
import { a, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import R from 'ramda'
import { maybe } from './_maybe'

//# justs :: Array (Maybe a) -> Array a
//.
//. Takes an array of Maybes and returns an array containing each Just's
//. value. Equivalent to Haskell's `catMaybes` function.
//.
//. See also [`lefts`](#lefts) and [`rights`](#rights).
//.
//. ```javascript
//. > S.justs([S.Just('foo'), S.Nothing, S.Just('baz')])
//. ['foo', 'baz']
//. ```
export const justs =
def('justs',
    {},
    [$.Array($Maybe(a)), $.Array(a)],
    R.chain(maybe([], R.of)));
