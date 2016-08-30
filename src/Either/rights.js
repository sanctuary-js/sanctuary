
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'
import R from 'ramda'

//# rights :: Array (Either a b) -> Array b
//.
//. Takes an array of Eithers and returns an array containing each Right's
//. value.
//.
//. See also [`lefts`](#lefts).
//.
//. ```javascript
//. > S.rights([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
//. [20, 10]
//. ```
export const rights =
def('rights',
    {},
    [$.Array($Either(a, b)), $.Array(b)],
    R.chain(function(either) {
      return either.isRight ? [either.value] : [];
    }));
