//# matchAll :: GlobalRegExp -> String -> Array (Array (Maybe String))
//.
//. Takes a pattern and a string, and returns an array of arrays of captured
//. values.
//.
//. `Maybe String` acknowledges the existence of optional capturing groups.
//.
//. See also [`match`](#match).
//.
//. ```javascript
//. > S.matchAll (/@([a-z]+)/g) ('Hello, world!')
//. []
//.
//. > S.matchAll (/@([a-z]+)/g) ('Hello, @foo! Hello, @bar! Hello, @baz!')
//. [[Just ('foo')], [Just ('bar')], [Just ('baz')]]
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

export default def
  ('matchAll')
  ({})
  ([$.GlobalRegExp, $.String, $.Array ($.Array ($.Maybe ($.String)))])
  (pattern => s => {
     const lastIndex = pattern.lastIndex;
     const result = [];
     while (true) {
       const match = pattern.exec (s);
       if (match == null) {
         pattern.lastIndex = lastIndex;
         return result;
       }
       const groups = result[result.length] = new Array (match.length - 1);
       for (let idx = 0; idx < groups.length; idx += 1) {
         const group = match[idx + 1];
         groups[idx] = group == null ? Maybe.Nothing : Maybe.Just (group);
       }
     }
   });
