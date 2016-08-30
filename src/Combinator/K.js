
import { a, b, def } from '../_internal'

//# K :: a -> b -> a
//.
//. The K combinator. Takes two values and returns the first. Equivalent to
//. Haskell's `const` function.
//.
//. ```javascript
//. > S.K('foo', 'bar')
//. 'foo'
//.
//. > R.map(S.K(42), R.range(0, 5))
//. [42, 42, 42, 42, 42]
//. ```
export const K =
def('K',
    {},
    [a, b, a],
    function(x, y) { return x; });
