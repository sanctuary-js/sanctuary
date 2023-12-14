//# values :: StrMap a -> Array a
//.
//. Returns the values of the given string map, in arbitrary order.
//.
//. ```javascript
//. > S.sort (S.values ({a: 1, c: 3, b: 2}))
//. [1, 2, 3]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('values')
  ({})
  ([$.StrMap (a), $.Array (a)])
  (Object.values);
