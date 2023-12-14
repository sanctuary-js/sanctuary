//# duplicate :: Extend w => w a -> w (w a)
//.
//. [Type-safe][sanctuary-def] version of [`Z.duplicate`][].
//. Adds one level of nesting to a comonadic structure.
//.
//. ```javascript
//. > S.duplicate (S.Just (1))
//. Just (Just (1))
//.
//. > S.duplicate ([1])
//. [[1]]
//.
//. > S.duplicate ([1, 2, 3])
//. [[1, 2, 3], [2, 3], [3]]
//.
//. > S.duplicate (S.reverse) ([1, 2]) ([3, 4])
//. [4, 3, 2, 1]
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, w} = makeTypeVars ({a: 0, w: 1});

export default def
  ('duplicate')
  ({w: [Z.Extend]})
  ([w (a), w (w (a))])
  (Z.duplicate);
