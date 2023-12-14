//# sort :: (Ord a, Applicative m, Foldable m, Monoid (m a)) => m a -> m a
//.
//. Performs a [stable sort][] of the elements of the given structure, using
//. [`Z.lte`][] for comparisons.
//.
//. Properties:
//.
//.   - `S.sort (S.sort (m)) = S.sort (m)` (idempotence)
//.
//. See also [`sortBy`](#sortBy).
//.
//. ```javascript
//. > S.sort (['foo', 'bar', 'baz'])
//. ['bar', 'baz', 'foo']
//.
//. > S.sort ([S.Left (4), S.Right (3), S.Left (2), S.Right (1)])
//. [Left (2), Left (4), Right (1), Right (3)]
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, m} = makeTypeVars ({a: 0, m: 1});

export default def
  ('sort')
  ({a: [Z.Ord], m: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([m (a), m (a)])
  (Z.sort);
