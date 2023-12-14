//# concat :: Semigroup a => a -> a -> a
//.
//. Curried version of [`Z.concat`][].
//.
//. ```javascript
//. > S.concat ('abc') ('def')
//. 'abcdef'
//.
//. > S.concat ([1, 2, 3]) ([4, 5, 6])
//. [1, 2, 3, 4, 5, 6]
//.
//. > S.concat ({x: 1, y: 2}) ({y: 3, z: 4})
//. {x: 1, y: 3, z: 4}
//.
//. > S.concat (S.Just ([1, 2, 3])) (S.Just ([4, 5, 6]))
//. Just ([1, 2, 3, 4, 5, 6])
//.
//. > S.concat (Sum (18)) (Sum (24))
//. Sum (42)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('concat')
  ({a: [Z.Semigroup]})
  ([a, a, a])
  (x => y => Z.concat (x, y));
