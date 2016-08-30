
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { Just } from '../Maybe'
import R from 'ramda'
import { def } from '../_internal'

//  requiredNonCapturingGroup :: Array String -> String
var requiredNonCapturingGroup = function(xs) {
  return '(?:' + xs.join('|') + ')';
};

//  optionalNonCapturingGroup :: Array String -> String
var optionalNonCapturingGroup = function(xs) {
  return requiredNonCapturingGroup(xs) + '?';
};

//  validFloatRepr :: String -> Boolean
var validFloatRepr = R.test(new RegExp(
  '^' +                     // start-of-string anchor
  '\\s*' +                  // any number of leading whitespace characters
  '[+-]?' +                 // optional sign
  requiredNonCapturingGroup([
    'Infinity',             // "Infinity"
    'NaN',                  // "NaN"
    requiredNonCapturingGroup([
      '[0-9]+',             // number
      '[0-9]+[.][0-9]+',    // number with interior decimal point
      '[0-9]+[.]',          // number with trailing decimal point
      '[.][0-9]+'           // number with leading decimal point
    ]) +
    optionalNonCapturingGroup([
      '[Ee]' +              // "E" or "e"
      '[+-]?' +             // optional sign
      '[0-9]+'              // exponent
    ])
  ]) +
  '\\s*' +                  // any number of trailing whitespace characters
  '$'                       // end-of-string anchor
));

//# parseFloat :: String -> Maybe Number
//.
//. Takes a string and returns Just the number represented by the string
//. if it does in fact represent a number; Nothing otherwise.
//.
//. ```javascript
//. > S.parseFloat('-123.45')
//. Just(-123.45)
//.
//. > S.parseFloat('foo.bar')
//. Nothing
//. ```
export const _parseFloat =
def('parseFloat',
    {},
    [$.String, $Maybe($.Number)],
    R.pipe(Just, R.filter(validFloatRepr), R.map(parseFloat)));
