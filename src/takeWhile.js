//# takeWhile :: (a -> Boolean) -> Array a -> Array a
//.
//. Discards the first element that does not satisfy the predicate,
//. and all subsequent elements.
//.
//. See also [`dropWhile`](#dropWhile).
//.
//. ```javascript
//. > S.takeWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])
//. [3, 3, 3, 7]
//.
//. > S.takeWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])
//. []
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('takeWhile')
  ({})
  ([$.Predicate (a), $.Array (a), $.Array (a)])
  (pred => xs => {
     let idx = 0;
     while (idx < xs.length && pred (xs[idx])) idx += 1;
     return xs.slice (0, idx);
   });
