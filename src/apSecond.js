//# apSecond :: Apply f => f a -> f b -> f b
//.
//. Curried version of [`Z.apSecond`][]. Combines two effectful actions,
//. keeping only the result of the second. Equivalent to Haskell's `(*>)`
//. function.
//.
//. See also [`apFirst`](#apFirst).
//.
//. ```javascript
//. > S.apSecond ([1, 2]) ([3, 4])
//. [3, 4, 3, 4]
//.
//. > S.apSecond (S.Just (1)) (S.Just (2))
//. Just (2)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('apSecond')
  ({f: [Z.Apply]})
  ([f (a), f (b), f (b)])
  (x => y => Z.apSecond (x, y));
