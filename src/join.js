//# join :: Chain m => m (m a) -> m a
//.
//. [Type-safe][sanctuary-def] version of [`Z.join`][].
//. Removes one level of nesting from a nested monadic structure.
//.
//. ```javascript
//. > S.join ([[1], [2], [3]])
//. [1, 2, 3]
//.
//. > S.join ([[[1, 2, 3]]])
//. [[1, 2, 3]]
//.
//. > S.join (S.Just (S.Just (1)))
//. Just (1)
//.
//. > S.join (S.Pair ('foo') (S.Pair ('bar') ('baz')))
//. Pair ('foobar') ('baz')
//. ```
//.
//. Replacing `Chain m => m` with `Function x` produces the W combinator
//. from combinatory logic:
//.
//.     Chain m => m (m a) -> m a
//.     Function x (Function x a) -> Function x a
//.     (x -> (x -> a)) -> (x -> a)
//.     (x -> x -> a) -> x -> a
//.     (a -> a -> b) -> a -> b
//.
//. ```javascript
//. > S.join (S.concat) ('abc')
//. 'abcabc'
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, m} = makeTypeVars ({a: 0, m: 1});

export default def
  ('join')
  ({m: [Z.Chain]})
  ([m (m (a)), m (a)])
  (Z.join);
