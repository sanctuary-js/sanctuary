
import { $Either, $Maybe } from '../_internal/Types'
import { Left, Right } from '../Either'
import { a, b, def } from '../_internal'

//# maybeToEither :: a -> Maybe b -> Either a b
//.
//. Converts a Maybe to an Either. Nothing becomes a Left (containing the
//. first argument); a Just becomes a Right.
//.
//. See also [`eitherToMaybe`](#eitherToMaybe).
//.
//. ```javascript
//. > S.maybeToEither('Expecting an integer', S.parseInt(10, 'xyz'))
//. Left('Expecting an integer')
//.
//. > S.maybeToEither('Expecting an integer', S.parseInt(10, '42'))
//. Right(42)
//. ```
export const maybeToEither =
def('maybeToEither',
    {},
    [a, $Maybe(b), $Either(a, b)],
    function(x, maybe) {
      return maybe.isNothing ? Left(x) : Right(maybe.value);
    });
