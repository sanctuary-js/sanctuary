//# test :: RegExp -> String -> Boolean
//.
//. Takes a pattern and a string, and returns `true` [iff][] the pattern
//. matches the string.
//.
//. ```javascript
//. > S.test (/^a/) ('abacus')
//. true
//.
//. > S.test (/^a/) ('banana')
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('test')
  ({})
  ([$.RegExp, $.String, $.Boolean])
  (pattern => s => {
     const lastIndex = pattern.lastIndex;
     const result = pattern.test (s);
     pattern.lastIndex = lastIndex;
     return result;
   });
