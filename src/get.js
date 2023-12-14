//# get :: (Any -> Boolean) -> String -> a -> Maybe b
//.
//. Takes a predicate, a property name, and an object and returns Just the
//. value of the specified object property if it exists and the value
//. satisfies the given predicate; Nothing otherwise.
//.
//. See also [`gets`](#gets), [`prop`](#prop), and [`value`](#value).
//.
//. ```javascript
//. > S.get (S.is ($.Number)) ('x') ({x: 1, y: 2})
//. Just (1)
//.
//. > S.get (S.is ($.Number)) ('x') ({x: '1', y: '2'})
//. Nothing
//.
//. > S.get (S.is ($.Number)) ('x') ({})
//. Nothing
//.
//. > S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3]})
//. Just ([1, 2, 3])
//.
//. > S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3, null]})
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('get')
  ({})
  ([$.Predicate ($.Any), $.String, a, $.Maybe (b)])
  (pred => key => x => {
     if (x != null) {
       const obj = Object (x);
       if (key in obj) {
         const val = obj[key];
         if (pred (val)) {
           return Maybe.Just (val);
         }
       }
     }
     return Maybe.Nothing;
   });
