//# reject :: Filterable f => (a -> Boolean) -> f a -> f a
//.
//. Curried version of [`Z.reject`][]. Discards every element that satisfies
//. the predicate.
//.
//. See also [`filter`](#filter).
//.
//. ```javascript
//. > S.reject (S.odd) ([1, 2, 3])
//. [2]
//.
//. > S.reject (S.odd) ({x: 1, y: 2, z: 3})
//. {y: 2}
//.
//. > S.reject (S.odd) (S.Nothing)
//. Nothing
//.
//. > S.reject (S.odd) (S.Just (0))
//. Just (0)
//.
//. > S.reject (S.odd) (S.Just (1))
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('reject')
  ({f: [Z.Filterable]})
  ([$.Predicate (a), f (a), f (a)])
  (pred => filterable => Z.reject (pred, filterable));
