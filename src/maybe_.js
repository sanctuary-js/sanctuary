//# maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b
//.
//. Variant of [`maybe`](#maybe) that takes a thunk so the default value
//. is only computed if required.
//.
//. ```javascript
//. > function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }
//.
//. > S.maybe_ (() => fib (30)) (Math.sqrt) (S.Just (1000000))
//. 1000
//.
//. > S.maybe_ (() => fib (30)) (Math.sqrt) (S.Nothing)
//. 832040
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('maybe_')
  ({})
  ([$.Thunk (b), $.Fn (a) (b), $.Maybe (a), b])
  (nothing => just => maybe => maybe.isJust ? just (maybe.value) : nothing ());
