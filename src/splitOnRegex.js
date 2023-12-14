//# splitOnRegex :: GlobalRegExp -> String -> Array String
//.
//. Takes a pattern and a string, and returns the result of splitting the
//. string at every non-overlapping occurrence of the pattern.
//.
//. Properties:
//.
//.   - `forall s :: String, t :: String.
//.      S.joinWith (s)
//.                 (S.splitOnRegex (S.regex ('g') (S.regexEscape (s))) (t))
//.      = t`
//.
//. See also [`splitOn`](#splitOn).
//.
//. ```javascript
//. > S.splitOnRegex (/[,;][ ]*/g) ('foo, bar, baz')
//. ['foo', 'bar', 'baz']
//.
//. > S.splitOnRegex (/[,;][ ]*/g) ('foo;bar;baz')
//. ['foo', 'bar', 'baz']
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('splitOnRegex')
  ({})
  ([$.GlobalRegExp, $.String, $.Array ($.String)])
  (pattern => s => {
     const lastIndex = pattern.lastIndex;
     const result = [];
     let idx = 0;
     while (true) {
       const match = pattern.exec (s);
       if (match == null) {
         result.push (s.slice (idx));
         break;
       }
       if (pattern.lastIndex === idx && match[0] === '') {
         if (pattern.lastIndex === s.length) break;
         pattern.lastIndex += 1;
         continue;
       }
       result.push (s.slice (idx, match.index));
       idx = match.index + match[0].length;
     }
     pattern.lastIndex = lastIndex;
     return result;
   });
