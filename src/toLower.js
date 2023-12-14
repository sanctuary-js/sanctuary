//# toLower :: String -> String
//.
//. Returns the lower-case equivalent of its argument.
//.
//. See also [`toUpper`](#toUpper).
//.
//. ```javascript
//. > S.toLower ('ABC def 123')
//. 'abc def 123'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('toLower')
  ({})
  ([$.String, $.String])
  (s => s.toLowerCase ());
