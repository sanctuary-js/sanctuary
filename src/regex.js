//# regex :: RegexFlags -> String -> RegExp
//.
//. Takes a [RegexFlags][] and a pattern, and returns a RegExp.
//.
//. ```javascript
//. > S.regex ('g') (':\\d+:')
//. /:\d+:/g
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('regex')
  ({})
  ([$.RegexFlags, $.String, $.RegExp])
  (flags => source => new RegExp (source, flags));
