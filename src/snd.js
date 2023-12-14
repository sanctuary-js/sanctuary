//# snd :: Pair a b -> b
//.
//. `snd (Pair (x) (y))` is equivalent to `y`.
//.
//. ```javascript
//. > S.snd (S.Pair ('foo') (42))
//. 42
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('snd')
  ({})
  ([$.Pair (a) (b), b])
  (Pair_.snd);
