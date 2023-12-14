//# append :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
//.
//. Returns the result of appending the first argument to the second.
//.
//. See also [`prepend`](#prepend).
//.
//. ```javascript
//. > S.append (3) ([1, 2])
//. [1, 2, 3]
//.
//. > S.append (3) (Cons (1) (Cons (2) (Nil)))
//. Cons (1) (Cons (2) (Cons (3) (Nil)))
//.
//. > S.append ([1]) (S.Nothing)
//. Just ([1])
//.
//. > S.append ([3]) (S.Just ([1, 2]))
//. Just ([1, 2, 3])
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('append')
  ({f: [Z.Applicative, Z.Semigroup]})
  ([a, f (a), f (a)])
  (x => xs => Z.append (x, xs));
