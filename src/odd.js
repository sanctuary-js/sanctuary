//# odd :: Integer -> Boolean
//.
//. Returns `true` if the given integer is odd; `false` if it is even.
//.
//. ```javascript
//. > S.odd (99)
//. true
//.
//. > S.odd (42)
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('odd')
  ({})
  ([$.Integer, $.Boolean])
  (n => n % 2 !== 0);
