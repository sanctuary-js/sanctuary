//# parseFloat :: String -> Maybe Number
//.
//. Takes a string and returns Just the number represented by the string
//. if it does in fact represent a number; Nothing otherwise.
//.
//. ```javascript
//. > S.parseFloat ('-123.45')
//. Just (-123.45)
//.
//. > S.parseFloat ('foo.bar')
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

//  requiredNonCapturingGroup :: Array String -> String
const requiredNonCapturingGroup = xs => (
  '(?:' + xs.join ('|') + ')'
);

//  optionalNonCapturingGroup :: Array String -> String
const optionalNonCapturingGroup = xs => (
  requiredNonCapturingGroup (xs) + '?'
);

//  validFloatRepr :: RegExp
const validFloatRepr = new RegExp (
  '^' +                     // start-of-string anchor
  '\\s*' +                  // any number of leading whitespace characters
  '[+-]?' +                 // optional sign
  requiredNonCapturingGroup ([
    'Infinity',             // "Infinity"
    'NaN',                  // "NaN"
    requiredNonCapturingGroup ([
      '[0-9]+',             // number
      '[0-9]+[.][0-9]+',    // number with interior decimal point
      '[0-9]+[.]',          // number with trailing decimal point
      '[.][0-9]+',          // number with leading decimal point
    ]) +
    optionalNonCapturingGroup ([
      '[Ee]' +              // "E" or "e"
      '[+-]?' +             // optional sign
      '[0-9]+',             // exponent
    ]),
  ]) +
  '\\s*' +                  // any number of trailing whitespace characters
  '$'                       // end-of-string anchor
);

export default def
  ('parseFloat')
  ({})
  ([$.String, $.Maybe ($.Number)])
  (s => validFloatRepr.test (s) ? Maybe.Just (parseFloat (s)) : Maybe.Nothing);
