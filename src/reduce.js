//# reduce :: Foldable f => (b -> a -> b) -> b -> f a -> b
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
//. > S.reduce (S.add) (0) ([1, 2, 3, 4, 5])
//. 15
//.
//. > S.reduce (xs => x => S.prepend (x) (xs)) ([]) ([1, 2, 3, 4, 5])
//. [5, 4, 3, 2, 1]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('reduce')
  ({f: [Z.Foldable]})
  ([$.Fn (b) ($.Fn (a) (b)), b, f (a), b])
  (f => initial => foldable =>
     Z.reduce ((y, x) => f (y) (x), initial, foldable));
