//# dropLast :: (Applicative f, Foldable f, Monoid (f a)) => Integer -> f a -> Maybe (f a)
//.
//. Returns Just all but the last N elements of the given structure if
//. N is non-negative and less than or equal to the size of the structure;
//. Nothing otherwise.
//.
//. ```javascript
//. > S.dropLast (0) (['foo', 'bar'])
//. Just (['foo', 'bar'])
//.
//. > S.dropLast (1) (['foo', 'bar'])
//. Just (['foo'])
//.
//. > S.dropLast (2) (['foo', 'bar'])
//. Just ([])
//.
//. > S.dropLast (3) (['foo', 'bar'])
//. Nothing
//.
//. > S.dropLast (3) (Cons (1) (Cons (2) (Cons (3) (Cons (4) (Nil)))))
//. Just (Cons (1) (Nil))
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import drop from './drop.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('dropLast')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([$.Integer, f (a), $.Maybe (f (a))])
  (n => xs => Z.map (Z.reverse, drop (n) (Z.reverse (xs))));
