
import { a, def } from '../_internal'
import { Ord } from '../_internal/Types'

//# max :: Ord a => a -> a -> a
//.
//. Returns the larger of its two arguments.
//.
//. Strings are compared lexicographically. Specifically, the Unicode
//. code point value of each character in the first string is compared
//. to the value of the corresponding character in the second string.
//.
//. See also [`min`](#min).
//.
//. ```javascript
//. > S.max(10, 2)
//. 10
//.
//. > S.max(new Date('1999-12-31'), new Date('2000-01-01'))
//. new Date('2000-01-01')
//.
//. > S.max('10', '2')
//. '2'
//. ```
export const max =
def('max',
    {a: [Ord]},
    [a, a, a],
    function(x, y) { return x > y ? x : y; });
