//# fromEither :: Either a a -> a
//.
//. Takes an Either with the same type on the Left and on the Right
//. and returns whichever value exists.
//.
//. The inverse of [`tagBy`](#tagBy).
//.
//. ```javascript
//. > S.fromEither (S.Left (42))
//. 42
//.
//. > S.fromEither (S.Right (42))
//. 42
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('fromEither')
  ({})
  ([$.Either (a) (a), a])
  (either => either.value);
