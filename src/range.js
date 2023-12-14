//# range :: Integer -> Integer -> Array Integer
//.
//. Returns an array of consecutive integers starting with the first argument
//. and ending with the second argument minus one. Returns `[]` if the second
//. argument is less than or equal to the first argument.
//.
//. ```javascript
//. > S.range (0) (10)
//. [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//.
//. > S.range (-5) (0)
//. [-5, -4, -3, -2, -1]
//.
//. > S.range (0) (-5)
//. []
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('range')
  ({})
  ([$.Integer, $.Integer, $.Array ($.Integer)])
  (from => to => {
     const result = [];
     for (let n = from; n < to; n += 1) result.push (n);
     return result;
   });
