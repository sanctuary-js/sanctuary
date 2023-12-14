//# any :: Foldable f => (a -> Boolean) -> f a -> Boolean
//.
//. Returns `true` [iff][] any element of the structure satisfies the
//. predicate.
//.
//. See also [`all`](#all) and [`none`](#none).
//.
//. ```javascript
//. > S.any (S.odd) ([])
//. false
//.
//. > S.any (S.odd) ([2, 4, 6])
//. false
//.
//. > S.any (S.odd) ([1, 2, 3])
//. true
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('any')
  ({f: [Z.Foldable]})
  ([$.Predicate (a), f (a), $.Boolean])
  (pred => foldable => Z.any (pred, foldable));
