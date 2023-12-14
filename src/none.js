//# none :: Foldable f => (a -> Boolean) -> f a -> Boolean
//.
//. Returns `true` [iff][] none of the elements of the structure satisfies
//. the predicate.
//.
//. Properties:
//.
//.   - `forall p :: a -> Boolean, xs :: Foldable f => f a.
//.      S.none (p) (xs) = S.not (S.any (p) (xs))`
//.
//.   - `forall p :: a -> Boolean, xs :: Foldable f => f a.
//.      S.none (p) (xs) = S.all (S.complement (p)) (xs)`
//.
//. See also [`all`](#all) and [`any`](#any).
//.
//. ```javascript
//. > S.none (S.odd) ([])
//. true
//.
//. > S.none (S.odd) ([2, 4, 6])
//. true
//.
//. > S.none (S.odd) ([1, 2, 3])
//. false
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('none')
  ({f: [Z.Foldable]})
  ([$.Predicate (a), f (a), $.Boolean])
  (pred => foldable => Z.none (pred, foldable));
