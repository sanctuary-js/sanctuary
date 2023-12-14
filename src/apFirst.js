//# apFirst :: Apply f => f a -> f b -> f a
//.
//. Curried version of [`Z.apFirst`][]. Combines two effectful actions,
//. keeping only the result of the first. Equivalent to Haskell's `(<*)`
//. function.
//.
//. See also [`apSecond`](#apSecond).
//.
//. ```javascript
//. > S.apFirst ([1, 2]) ([3, 4])
//. [1, 1, 2, 2]
//.
//. > S.apFirst (S.Just (1)) (S.Just (2))
//. Just (1)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('apFirst')
  ({f: [Z.Apply]})
  ([f (a), f (b), f (a)])
  (x => y => Z.apFirst (x, y));
