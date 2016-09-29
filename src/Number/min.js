
import { a, def } from '../_internal'
import { Ord } from '../_internal/Types'

//# min :: Ord a => a -> a -> a
//.
//. Returns the smaller of its two arguments.
//.
//. Strings are compared lexicographically. Specifically, the Unicode
//. code point value of each character in the first string is compared
//. to the value of the corresponding character in the second string.
//.
//. See also [`max`](#max).
//.
//. ```javascript
//. > S.min(10, 2)
//. 2
//.
//. > S.min(new Date('1999-12-31'), new Date('2000-01-01'))
//. new Date('1999-12-31')
//.
//. > S.min('10', '2')
//. '10'
//. ```
export const min =
def('min',
    {a: [Ord]},
    [a, a, a],
    function(x, y) { return x < y ? x : y; });
