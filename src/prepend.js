//# prepend :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
//.
//. Returns the result of prepending the first argument to the second.
//.
//. See also [`append`](#append).
//.
//. ```javascript
//. > S.prepend (1) ([2, 3])
//. [1, 2, 3]
//.
//. > S.prepend (1) (Cons (2) (Cons (3) (Nil)))
//. Cons (1) (Cons (2) (Cons (3) (Nil)))
//.
//. > S.prepend ([1]) (S.Nothing)
//. Just ([1])
//.
//. > S.prepend ([1]) (S.Just ([2, 3]))
//. Just ([1, 2, 3])
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('prepend')
  ({f: [Z.Applicative, Z.Semigroup]})
  ([a, f (a), f (a)])
  (x => xs => Z.prepend (x, xs));
