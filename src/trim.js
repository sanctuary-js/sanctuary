//# trim :: String -> String
//.
//. Strips leading and trailing whitespace characters.
//.
//. ```javascript
//. > S.trim ('\t\t foo bar \n')
//. 'foo bar'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('trim')
  ({})
  ([$.String, $.String])
  (s => s.trim ());
