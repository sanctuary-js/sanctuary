//# sum :: Foldable f => f FiniteNumber -> FiniteNumber
//.
//. Returns the sum of the given array of (finite) numbers.
//.
//. ```javascript
//. > S.sum ([1, 2, 3, 4, 5])
//. 15
//.
//. > S.sum ([])
//. 0
//.
//. > S.sum (S.Just (42))
//. 42
//.
//. > S.sum (S.Nothing)
//. 0
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {f} = makeTypeVars ({f: 1});

export default def
  ('sum')
  ({f: [Z.Foldable]})
  ([f ($.FiniteNumber), $.FiniteNumber])
  (foldable => Z.reduce ((x, y) => x + y, 0, foldable));
