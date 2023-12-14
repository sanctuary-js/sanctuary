//# gets :: (Any -> Boolean) -> Array String -> a -> Maybe b
//.
//. Takes a predicate, a property path (an array of property names), and
//. an object and returns Just the value at the given path if such a path
//. exists and the value satisfies the given predicate; Nothing otherwise.
//.
//. See also [`get`](#get).
//.
//. ```javascript
//. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: 42}}})
//. Just (42)
//.
//. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: '42'}}})
//. Nothing
//.
//. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({})
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('gets')
  ({})
  ([$.Predicate ($.Any), $.Array ($.String), a, $.Maybe (b)])
  (pred => keys => x =>
     Z.filter (pred, keys.reduce ((maybe, key) => {
       if (maybe.isJust && maybe.value != null) {
         const obj = Object (maybe.value);
         if (key in obj) return Maybe.Just (obj[key]);
       }
       return Maybe.Nothing;
     }, Maybe.Just (x))));
