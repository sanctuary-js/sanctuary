//# product :: Foldable f => f FiniteNumber -> FiniteNumber
//.
//. Returns the product of the given array of (finite) numbers.
//.
//. ```javascript
//. > S.product ([1, 2, 3, 4, 5])
//. 120
//.
//. > S.product ([])
//. 1
//.
//. > S.product (S.Just (42))
//. 42
//.
//. > S.product (S.Nothing)
//. 1
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {f} = makeTypeVars ({f: 1});

export default def
  ('product')
  ({f: [Z.Foldable]})
  ([f ($.FiniteNumber), $.FiniteNumber])
  (foldable => Z.reduce ((x, y) => x * y, 1, foldable));
