//# isNothing :: Maybe a -> Boolean
//.
//. Returns `true` if the given Maybe is Nothing; `false` if it is a Just.
//.
//. ```javascript
//. > S.isNothing (S.Nothing)
//. true
//.
//. > S.isNothing (S.Just (42))
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('isNothing')
  ({})
  ([$.Maybe (a), $.Boolean])
  (maybe => maybe.isNothing);
