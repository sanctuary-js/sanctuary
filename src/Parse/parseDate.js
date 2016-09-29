
import { Just, Nothing } from '../Maybe'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { def } from '../_internal'

//# parseDate :: String -> Maybe Date
//.
//. Takes a string and returns Just the date represented by the string
//. if it does in fact represent a date; Nothing otherwise.
//.
//. ```javascript
//. > S.parseDate('2011-01-19T17:40:00Z')
//. Just(new Date('2011-01-19T17:40:00.000Z'))
//.
//. > S.parseDate('today')
//. Nothing
//. ```
export const parseDate =
def('parseDate',
    {},
    [$.String, $Maybe($.Date)],
    function(s) {
      var d = new Date(s);
      return d.valueOf() === d.valueOf() ? Just(d) : Nothing;
    });
