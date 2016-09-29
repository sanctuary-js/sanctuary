
import { Left, Right } from './Either'
import { a, b, def } from '../_internal'
import { $Either } from '../_internal/Types'

//# toEither :: a -> b? -> Either a b
//.
//. Converts an arbitrary value to an Either: a Left if the value is `null`
//. or `undefined`; a Right otherwise. The first argument specifies the
//. value of the Left in the "failure" case.
//.
//. ```javascript
//. > S.toEither('XYZ', null)
//. Left('XYZ')
//.
//. > S.toEither('XYZ', 'ABC')
//. Right('ABC')
//.
//. > R.map(R.head, S.toEither('Invalid protocol', 'ftp://example.com/'.match(/^https?:/)))
//. Left('Invalid protocol')
//.
//. > R.map(R.head, S.toEither('Invalid protocol', 'https://example.com/'.match(/^https?:/)))
//. Right('https:')
//. ```
export const toEither =
def('toEither',
    {},
    [a, b, $Either(a, b)],
    function(x, y) { return y == null ? Left(x) : Right(y); });
