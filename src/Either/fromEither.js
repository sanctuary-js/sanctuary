
import { a, b, def } from '../_internal'
import { $Either } from '../_internal/Types'

//# fromEither :: b -> Either a b -> b
//.
//. Takes a default value and an Either, and returns the Right value
//. if the Either is a Right; the default value otherwise.
//.
//. ```javascript
//. > S.fromEither(0, S.Right(42))
//. 42
//.
//. > S.fromEither(0, S.Left(42))
//. 0
//. ```
export const fromEither =
def('fromEither',
    {},
    [b, $Either(a, b), b],
    function(x, either) { return either.isRight ? either.value : x; });
