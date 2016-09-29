
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'
import R from 'ramda'

//# lefts :: Array (Either a b) -> Array a
//.
//. Takes an array of Eithers and returns an array containing each Left's
//. value.
//.
//. See also [`rights`](#rights).
//.
//. ```javascript
//. > S.lefts([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
//. ['foo', 'bar']
//. ```
export const lefts =
def('lefts',
    {},
    [$.Array($Either(a, b)), $.Array(a)],
    R.chain(function(either) {
      return either.isLeft ? [either.value] : [];
    }));
