//# reduce_ :: Foldable f => (a -> b -> b) -> b -> f a -> b
//.
//. Variant of [`reduce`](#reduce) that takes a reducing function with
//. arguments flipped.
//.
//. ```javascript
//. > S.reduce_ (S.append) ([]) (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. [1, 2, 3]
//.
//. > S.reduce_ (S.prepend) ([]) (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. [3, 2, 1]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('reduce_')
  ({f: [Z.Foldable]})
  ([$.Fn (a) ($.Fn (b) (b)), b, f (a), b])
  (f => initial => foldable =>
     Z.reduce ((y, x) => f (x) (y), initial, foldable));
