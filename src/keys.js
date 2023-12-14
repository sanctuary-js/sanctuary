//# keys :: StrMap a -> Array String
//.
//. Returns the keys of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.sort (S.keys ({b: 2, c: 3, a: 1}))
//. ['a', 'b', 'c']
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('keys')
  ({})
  ([$.StrMap (a), $.Array ($.String)])
  (Object.keys);
