//# swap :: Pair a b -> Pair b a
//.
//. `swap (Pair (x) (y))` is equivalent to `Pair (y) (x)`.
//.
//. ```javascript
//. > S.swap (S.Pair ('foo') (42))
//. Pair (42) ('foo')
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('swap')
  ({})
  ([$.Pair (a) (b), $.Pair (b) (a)])
  (Pair_.swap);
