//# fromMaybe_ :: (() -> a) -> Maybe a -> a
//.
//. Variant of [`fromMaybe`](#fromMaybe) that takes a thunk so the default
//. value is only computed if required.
//.
//. ```javascript
//. > function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }
//.
//. > S.fromMaybe_ (() => fib (30)) (S.Just (1000000))
//. 1000000
//.
//. > S.fromMaybe_ (() => fib (30)) (S.Nothing)
//. 832040
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('fromMaybe_')
  ({})
  ([$.Thunk (a), $.Maybe (a), a])
  (nothing => maybe => maybe.isJust ? maybe.value : nothing ());
