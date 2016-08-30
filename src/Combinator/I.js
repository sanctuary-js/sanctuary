
import { a, def } from '../_internal'

//# I :: a -> a
//.
//. The I combinator. Returns its argument. Equivalent to Haskell's `id`
//. function.
//.
//. ```javascript
//. > S.I('foo')
//. 'foo'
//. ```
export const I =
def('I',
    {},
    [a, a],
    function(x) { return x; });
