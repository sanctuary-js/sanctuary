//# replace :: (Array (Maybe String) -> String) -> RegExp -> String -> String
//.
//. Replaces occurrences of the given pattern within the given string
//. in accordance with the given replacement function, which receives an
//. array of captured values. Replaces all occurrences of the pattern if
//. its `g` flag is set; just the first occurrence otherwise.
//.
//. ```javascript
//. > S.replace (([$1]) => S.maybe ('') (S.toUpper) ($1)) (/(\w)/) ('foo')
//. 'Foo'
//.
//. > S.replace (([$1]) => S.maybe ('') (S.toUpper) ($1)) (/(\w)/g) ('foo')
//. 'FOO'
//.
//. > S.replace (S.show) (/(foo)(bar)?/) ('<>')
//. '<>'
//.
//. > S.replace (S.show) (/(foo)(bar)?/) ('<foo>')
//. '<[Just ("foo"), Nothing]>'
//.
//. > S.replace (S.show) (/(foo)(bar)?/) ('<foobar>')
//. '<[Just ("foo"), Just ("bar")]>'
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';

export default def
  ('replace')
  ({})
  ([$.Fn ($.Array ($.Maybe ($.String))) ($.String),
    $.RegExp,
    $.String,
    $.String])
  (substitute => pattern => text =>
     text.replace (pattern, (...args) => {
       const groups = [];
       for (let idx = 1; ; idx += 1) {
         const arg = args[idx];
         if (typeof arg === 'number') break;
         groups.push (arg == null ? Maybe.Nothing : Maybe.Just (arg));
       }
       return substitute (groups);
     }));
