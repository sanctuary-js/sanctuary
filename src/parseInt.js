//# parseInt :: Radix -> String -> Maybe Integer
//.
//. Takes a radix (an integer between 2 and 36 inclusive) and a string,
//. and returns Just the number represented by the string if it does in
//. fact represent a number in the base specified by the radix; Nothing
//. otherwise.
//.
//. This function is stricter than [`parseInt`][parseInt]: a string
//. is considered to represent an integer only if all its non-prefix
//. characters are members of the character set specified by the radix.
//.
//. ```javascript
//. > S.parseInt (10) ('-42')
//. Just (-42)
//.
//. > S.parseInt (16) ('0xFF')
//. Just (255)
//.
//. > S.parseInt (16) ('0xGG')
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';
import Radix from './internal/Radix.js';

export default def
  ('parseInt')
  ({})
  ([Radix, $.String, $.Maybe ($.Integer)])
  (radix => s => {
     const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice (0, radix);
     const pattern = new RegExp ('^[' + charset + ']+$', 'i');
     const t = s.replace (/^[+-]/, '');
     if (pattern.test (radix === 16 ? t.replace (/^0x/i, '') : t)) {
       const n = parseInt (s, radix);
       if (
         Number.isInteger (n) &&
         n >= Number.MIN_SAFE_INTEGER &&
         n <= Number.MAX_SAFE_INTEGER
       ) return Maybe.Just (n);
     }
     return Maybe.Nothing;
   });
