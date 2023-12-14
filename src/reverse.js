//# reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f a
//.
//. Reverses the elements of the given structure.
//.
//. ```javascript
//. > S.reverse ([1, 2, 3])
//. [3, 2, 1]
//.
//. > S.reverse (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. Cons (3) (Cons (2) (Cons (1) (Nil)))
//.
//. > S.pipe ([S.splitOn (''), S.reverse, S.joinWith ('')]) ('abc')
//. 'cba'
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('reverse')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([f (a), f (a)])
  (Z.reverse);
