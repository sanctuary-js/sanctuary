//# all :: Foldable f => (a -> Boolean) -> f a -> Boolean
//.
//. Returns `true` [iff][] all the elements of the structure satisfy the
//. predicate.
//.
//. See also [`any`](#any) and [`none`](#none).
//.
//. ```javascript
//. > S.all (S.odd) ([])
//. true
//.
//. > S.all (S.odd) ([1, 3, 5])
//. true
//.
//. > S.all (S.odd) ([1, 2, 3])
//. false
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('all')
  ({f: [Z.Foldable]})
  ([$.Predicate (a), f (a), $.Boolean])
  (pred => foldable => Z.all (pred, foldable));
