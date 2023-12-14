//# clamp :: Ord a => a -> a -> a -> a
//.
//. Takes a lower bound, an upper bound, and a value of the same type.
//. Returns the value if it is within the bounds; the nearer bound otherwise.
//.
//. See also [`min`](#min) and [`max`](#max).
//.
//. ```javascript
//. > S.clamp (0) (100) (42)
//. 42
//.
//. > S.clamp (0) (100) (-1)
//. 0
//.
//. > S.clamp ('A') ('Z') ('~')
//. 'Z'
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('clamp')
  ({a: [Z.Ord]})
  ([a, a, a, a])
  (lower => upper => x => Z.clamp (lower, upper, x));
