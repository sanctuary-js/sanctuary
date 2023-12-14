//# unwords :: Array String -> String
//.
//. Takes an array of words and returns the result of joining the words
//. with separating spaces.
//.
//. See also [`words`](#words).
//.
//. ```javascript
//. > S.unwords (['foo', 'bar', 'baz'])
//. 'foo bar baz'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('unwords')
  ({})
  ([$.Array ($.String), $.String])
  (words => words.join (' '));
