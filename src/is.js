//# is :: Type -> Any -> Boolean
//.
//. Returns `true` [iff][] the given value is a member of the specified type.
//. See [`$.test`][] for details.
//.
//. ```javascript
//. > S.is ($.Array ($.Integer)) ([1, 2, 3])
//. true
//.
//. > S.is ($.Array ($.Integer)) ([1, 2, 3.14])
//. false
//. ```

import $ from 'sanctuary-def';

import config from './config.js';
import def from './internal/def.js';

export default def
  ('is')
  ({})
  ([$.Type, $.Any, $.Boolean])
  ($.test (config.env));
