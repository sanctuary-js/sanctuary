//# isRight :: Either a b -> Boolean
//.
//. Returns `true` if the given Either is a Right; `false` if it is a Left.
//.
//. ```javascript
//. > S.isRight (S.Right (42))
//. true
//.
//. > S.isRight (S.Left ('Cannot divide by zero'))
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('isRight')
  ({})
  ([$.Either (a) (b), $.Boolean])
  (either => either.isRight);
