//# encase :: Throwing e a b -> a -> Either e b
//.
//. Takes a function that may throw and returns a pure function.
//.
//. ```javascript
//. > S.encase (JSON.parse) ('["foo","bar","baz"]')
//. Right (['foo', 'bar', 'baz'])
//.
//. > S.encase (JSON.parse) ('[')
//. Left (new SyntaxError ('Unexpected end of JSON input'))
//. ```

import $ from 'sanctuary-def';
import Either from 'sanctuary-either';

import def from './internal/def.js';
import Throwing from './internal/Throwing.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, e} = makeTypeVars ({a: 0, b: 0, e: 0});

export default def
  ('encase')
  ({})
  ([Throwing (e) (a) (b), a, $.Either (e) (b)])
  (f => x => {
     try {
       return Either.Right (f (x));
     } catch (err) {
       return Either.Left (err);
     }
   });
