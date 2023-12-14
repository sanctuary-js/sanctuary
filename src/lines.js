//# lines :: String -> Array String
//.
//. Takes a string and returns the array of lines the string contains
//. (lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
//. The resulting strings do not contain newlines.
//.
//. See also [`unlines`](#unlines).
//.
//. ```javascript
//. > S.lines ('foo\nbar\nbaz\n')
//. ['foo', 'bar', 'baz']
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('lines')
  ({})
  ([$.String, $.Array ($.String)])
  (s => {
     if (s === '') return [];
     return (s.replace (/\r\n?/g, '\n')).match (/^(?=[\s\S]).*/gm);
   });
