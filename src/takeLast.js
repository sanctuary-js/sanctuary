//# takeLast :: (Applicative f, Foldable f, Monoid (f a)) => Integer -> f a -> Maybe (f a)
//.
//. Returns Just the last N elements of the given structure if N is
//. non-negative and less than or equal to the size of the structure;
//. Nothing otherwise.
//.
//. ```javascript
//. > S.takeLast (0) (['foo', 'bar'])
//. Just ([])
//.
//. > S.takeLast (1) (['foo', 'bar'])
//. Just (['bar'])
//.
//. > S.takeLast (2) (['foo', 'bar'])
//. Just (['foo', 'bar'])
//.
//. > S.takeLast (3) (['foo', 'bar'])
//. Nothing
//.
//. > S.takeLast (3) (Cons (1) (Cons (2) (Cons (3) (Cons (4) (Nil)))))
//. Just (Cons (2) (Cons (3) (Cons (4) (Nil))))
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import take from './take.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('takeLast')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([$.Integer, f (a), $.Maybe (f (a))])
  (n => xs => Z.map (Z.reverse, take (n) (Z.reverse (xs))));
