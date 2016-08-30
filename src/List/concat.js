
import { a, def } from '../_internal'
import { Semigroup } from '../_internal/Types'

//# concat :: Semigroup a => a -> a -> a
//.
//. Concatenates two (homogeneous) arrays, two strings, or two values of any
//. other type which satisfies the [Semigroup][] specification.
//.
//. ```javascript
//. > S.concat([1, 2, 3], [4, 5, 6])
//. [1, 2, 3, 4, 5, 6]
//.
//. > S.concat('foo', 'bar')
//. 'foobar'
//.
//. > S.concat(S.Just('foo'), S.Just('bar'))
//. S.Just('foobar')
//. ```
export const concat =
def('concat',
    {a: [Semigroup]},
    [a, a, a],
    function(x, y) { return x.concat(y); });
