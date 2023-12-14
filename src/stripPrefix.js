//# stripPrefix :: String -> String -> Maybe String
//.
//. Returns Just the portion of the given string (the second argument) left
//. after removing the given prefix (the first argument) if the string starts
//. with the prefix; Nothing otherwise.
//.
//. See also [`stripSuffix`](#stripSuffix).
//.
//. ```javascript
//. > S.stripPrefix ('https://') ('https://sanctuary.js.org')
//. Just ('sanctuary.js.org')
//.
//. > S.stripPrefix ('https://') ('http://sanctuary.js.org')
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

export default def
  ('stripPrefix')
  ({})
  ([$.String, $.String, $.Maybe ($.String)])
  (prefix => s =>
     s.startsWith (prefix) ?
     Maybe.Just (s.slice (prefix.length)) :
     Maybe.Nothing);
