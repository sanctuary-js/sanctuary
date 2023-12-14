//# parseDate :: String -> Maybe ValidDate
//.
//. Takes a string `s` and returns `Just (new Date (s))` if `new Date (s)`
//. evaluates to a [`ValidDate`][ValidDate] value; Nothing otherwise.
//.
//. As noted in [#488][], this function's behaviour is unspecified for some
//. inputs! [MDN][date parsing] warns against using the `Date` constructor
//. to parse date strings:
//.
//. > __Note:__ parsing of date strings with the `Date` constructor […] is
//. > strongly discouraged due to browser differences and inconsistencies.
//. > Support for RFC 2822 format strings is by convention only. Support for
//. > ISO 8601 formats differs in that date-only strings (e.g. "1970-01-01")
//. > are treated as UTC, not local.
//.
//. ```javascript
//. > S.parseDate ('2011-01-19T17:40:00Z')
//. Just (new Date ('2011-01-19T17:40:00.000Z'))
//.
//. > S.parseDate ('today')
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

export default def
  ('parseDate')
  ({})
  ([$.String, $.Maybe ($.ValidDate)])
  (s => {
     const date = new Date (s);
     return isNaN (date.valueOf ()) ? Maybe.Nothing : Maybe.Just (date);
   });
