//# size :: Foldable f => f a -> NonNegativeInteger
//.
//. Returns the number of elements of the given structure.
//.
//. ```javascript
//. > S.size ([])
//. 0
//.
//. > S.size (['foo', 'bar', 'baz'])
//. 3
//.
//. > S.size (Nil)
//. 0
//.
//. > S.size (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))
//. 3
//.
//. > S.size (S.Nothing)
//. 0
//.
//. > S.size (S.Just ('quux'))
//. 1
//.
//. > S.size (S.Pair ('ignored!') ('counted!'))
//. 1
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('size')
  ({f: [Z.Foldable]})
  ([f (a), $.NonNegativeInteger])
  (Z.size);
