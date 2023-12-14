//# or :: Boolean -> Boolean -> Boolean
//.
//. Boolean "or".
//.
//. ```javascript
//. > S.or (false) (false)
//. false
//.
//. > S.or (false) (true)
//. true
//.
//. > S.or (true) (false)
//. true
//.
//. > S.or (true) (true)
//. true
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('or')
  ({})
  ([$.Boolean, $.Boolean, $.Boolean])
  (x => y => x || y);
