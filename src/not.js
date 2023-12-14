//# not :: Boolean -> Boolean
//.
//. Boolean "not".
//.
//. See also [`complement`](#complement).
//.
//. ```javascript
//. > S.not (false)
//. true
//.
//. > S.not (true)
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('not')
  ({})
  ([$.Boolean, $.Boolean])
  (x => !x);
