//# joinWith :: String -> Array String -> String
//.
//. Joins the strings of the second argument separated by the first argument.
//.
//. Properties:
//.
//.   - `forall s :: String, t :: String.
//.      S.joinWith (s) (S.splitOn (s) (t)) = t`
//.
//. See also [`splitOn`](#splitOn) and [`intercalate`](#intercalate).
//.
//. ```javascript
//. > S.joinWith (':') (['foo', 'bar', 'baz'])
//. 'foo:bar:baz'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('joinWith')
  ({})
  ([$.String, $.Array ($.String), $.String])
  (separator => strings => strings.join (separator));
