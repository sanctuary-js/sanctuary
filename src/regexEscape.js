//# regexEscape :: String -> String
//.
//. Takes a string that may contain regular expression metacharacters,
//. and returns a string with those metacharacters escaped.
//.
//. Properties:
//.
//.   - `forall s :: String.
//.      S.test (S.regex ('') (S.regexEscape (s))) (s) = true`
//.
//. ```javascript
//. > S.regexEscape ('-=*{XYZ}*=-')
//. '\\-=\\*\\{XYZ\\}\\*=\\-'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('regexEscape')
  ({})
  ([$.String, $.String])
  (s => s.replace (/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
