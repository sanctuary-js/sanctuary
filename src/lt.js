//# lt :: Ord a => a -> a -> Boolean
//.
//. Returns `true` [iff][] the *second* argument is less than the first
//. according to [`Z.lt`][].
//.
//. ```javascript
//. > S.filter (S.lt (3)) ([1, 2, 3, 4, 5])
//. [1, 2]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('lt')
  ({a: [Z.Ord]})
  ([a, a, $.Boolean])
  (y => x => Z.lt (x, y));
