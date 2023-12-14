//# parseJson :: (Any -> Boolean) -> String -> Maybe a
//.
//. Takes a predicate and a string that may or may not be valid JSON, and
//. returns Just the result of applying `JSON.parse` to the string *if* the
//. result satisfies the predicate; Nothing otherwise.
//.
//. ```javascript
//. > S.parseJson (S.is ($.Array ($.Integer))) ('[')
//. Nothing
//.
//. > S.parseJson (S.is ($.Array ($.Integer))) ('["1","2","3"]')
//. Nothing
//.
//. > S.parseJson (S.is ($.Array ($.Integer))) ('[0,1.5,3,4.5]')
//. Nothing
//.
//. > S.parseJson (S.is ($.Array ($.Integer))) ('[1,2,3]')
//. Just ([1, 2, 3])
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('parseJson')
  ({})
  ([$.Predicate ($.Any), $.String, $.Maybe (a)])
  (pred => s => {
     let x;
     try {
       x = JSON.parse (s);
     } catch (_) {
       return Maybe.Nothing;
     }
     return pred (x) ? Maybe.Just (x) : Maybe.Nothing;
   });
