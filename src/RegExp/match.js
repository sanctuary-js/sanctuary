
import { Just, Nothing, toMaybe } from '../Maybe'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import R from 'ramda'
import { def } from '../_internal'

//# match :: RegExp -> String -> Maybe (Array (Maybe String))
//.
//. Takes a pattern and a string, and returns Just an array of matches
//. if the pattern matches the string; Nothing otherwise. Each match has
//. type `Maybe String`, where Nothing represents an unmatched optional
//. capturing group.
//.
//. ```javascript
//. > S.match(/(good)?bye/, 'goodbye')
//. Just([Just('goodbye'), Just('good')])
//.
//. > S.match(/(good)?bye/, 'bye')
//. Just([Just('bye'), Nothing])
//. ```
export const match =
def('match',
    {},
    [$.RegExp, $.String, $Maybe($.Array($Maybe($.String)))],
    function(pattern, s) {
      var match = s.match(pattern);
      return match == null ? Nothing : Just(R.map(toMaybe, match));
    });
