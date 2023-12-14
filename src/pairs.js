//# pairs :: StrMap a -> Array (Pair String a)
//.
//. Returns the key–value pairs of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.sort (S.pairs ({b: 2, a: 1, c: 3}))
//. [Pair ('a') (1), Pair ('b') (2), Pair ('c') (3)]
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('pairs')
  ({})
  ([$.StrMap (a), $.Array ($.Pair ($.String) (a))])
  (sm => (Object.entries (sm)).map (([key, val]) => Pair_ (key) (val)));
