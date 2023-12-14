//# filter :: Filterable f => (a -> Boolean) -> f a -> f a
//.
//. Curried version of [`Z.filter`][]. Discards every element that does not
//. satisfy the predicate.
//.
//. See also [`reject`](#reject).
//.
//. ```javascript
//. > S.filter (S.odd) ([1, 2, 3])
//. [1, 3]
//.
//. > S.filter (S.odd) ({x: 1, y: 2, z: 3})
//. {x: 1, z: 3}
//.
//. > S.filter (S.odd) (S.Nothing)
//. Nothing
//.
//. > S.filter (S.odd) (S.Just (0))
//. Nothing
//.
//. > S.filter (S.odd) (S.Just (1))
//. Just (1)
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('filter')
  ({f: [Z.Filterable]})
  ([$.Predicate (a), f (a), f (a)])
  (pred => filterable => Z.filter (pred, filterable));
