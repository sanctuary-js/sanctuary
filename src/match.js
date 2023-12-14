//# match :: NonGlobalRegExp -> String -> Maybe (Array (Maybe String))
//.
//. Takes a pattern and a string, and returns Just an array of captured
//. values if the pattern matches the string; Nothing otherwise.
//.
//. `Maybe String` acknowledges the existence of optional capturing groups.
//.
//. Properties:
//.
//.   - `forall p :: Pattern, s :: String.
//.      S.head (S.matchAll (S.regex ('g') (p)) (s))
//.      = S.match (S.regex ('') (p)) (s)`
//.
//. See also [`matchAll`](#matchAll).
//.
//. ```javascript
//. > S.match (/^(.+[.].+?)(?::(.+))?$/) ('XXX')
//. Nothing
//.
//. > S.match (/^(.+[.].+?)(?::(.+))?$/) ('example.com')
//. Just ([Just ('example.com'), Nothing])
//.
//. > S.match (/^(.+[.].+?)(?::(.+))?$/) ('example.com:8888')
//. Just ([Just ('example.com'), Just ('8888')])
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

export default def
  ('match')
  ({})
  ([$.NonGlobalRegExp, $.String, $.Maybe ($.Array ($.Maybe ($.String)))])
  (pattern => s => {
     const match = s.match (pattern);
     if (match == null) return Maybe.Nothing;
     const groups = new Array (match.length - 1);
     for (let idx = 0; idx < groups.length; idx += 1) {
       const group = match[idx + 1];
       groups[idx] = group == null ? Maybe.Nothing : Maybe.Just (group);
     }
     return Maybe.Just (groups);
   });
