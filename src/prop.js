//# prop :: String -> a -> b
//.
//. Takes a property name and an object with known properties and returns
//. the value of the specified property. If for some reason the object
//. lacks the specified property, a type error is thrown.
//.
//. For accessing properties of uncertain objects, use [`get`](#get) instead.
//. For accessing string map values by key, use [`value`](#value) instead.
//.
//. ```javascript
//. > S.prop ('a') ({a: 1, b: 2})
//. 1
//. ```

import $ from 'sanctuary-def';
import show from 'sanctuary-show';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('prop')
  ({})
  ([$.String, a, b])
  (key => x => {
     if (x != null) {
       const obj = Object (x);
       if (key in obj) return obj[key];
     }
     throw new TypeError (
       `‘prop’ expected object to have a property named ‘${key}’; ${show (x)} does not`
     );
   });
