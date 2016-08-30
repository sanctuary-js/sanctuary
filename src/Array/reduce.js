
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { Foldable } from '../_internal/Types'
import { reduce_ } from './reduce_'

//# reduce :: Foldable f => (a -> b -> a) -> a -> f b -> a
//.
//. Takes a curried binary function, an initial value, and a [Foldable][],
//. and applies the function to the initial value and the Foldable's first
//. value, then applies the function to the result of the previous
//. application and the Foldable's second value. Repeats this process
//. until each of the Foldable's values has been used. Returns the initial
//. value if the Foldable is empty; the result of the final application
//. otherwise.
//.
//. See also [`reduce_`](#reduce_).
//.
//. ```javascript
//. > S.reduce(S.add, 0, [1, 2, 3, 4, 5])
//. 15
//.
//. > S.reduce(xs => x => [x].concat(xs), [], [1, 2, 3, 4, 5])
//. [5, 4, 3, 2, 1]
//. ```
export const reduce =
def('reduce',
    {b: [Foldable]},
    [$.Function, a, b, a],
    function(f_, initial, foldable) {
      var f = function(a, b) {
        return f_(a)(b);
      };
      return reduce_(f, initial, foldable);
    });
