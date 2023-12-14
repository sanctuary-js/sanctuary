//# isLeft :: Either a b -> Boolean
//.
//. Returns `true` if the given Either is a Left; `false` if it is a Right.
//.
//. ```javascript
//. > S.isLeft (S.Left ('Cannot divide by zero'))
//. true
//.
//. > S.isLeft (S.Right (42))
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('isLeft')
  ({})
  ([$.Either (a) (b), $.Boolean])
  (either => either.isLeft);
