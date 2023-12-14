//# gte :: Ord a => a -> a -> Boolean
//.
//. Returns `true` [iff][] the *second* argument is greater than or equal
//. to the first according to [`Z.gte`][].
//.
//. ```javascript
//. > S.filter (S.gte (3)) ([1, 2, 3, 4, 5])
//. [3, 4, 5]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('gte')
  ({a: [Z.Ord]})
  ([a, a, $.Boolean])
  (y => x => Z.gte (x, y));
