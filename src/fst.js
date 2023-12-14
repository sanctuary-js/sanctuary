//# fst :: Pair a b -> a
//.
//. `fst (Pair (x) (y))` is equivalent to `x`.
//.
//. ```javascript
//. > S.fst (S.Pair ('foo') (42))
//. 'foo'
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('fst')
  ({})
  ([$.Pair (a) (b), a])
  (Pair_.fst);
