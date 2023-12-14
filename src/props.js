//# props :: Array String -> a -> b
//.
//. Takes a property path (an array of property names) and an object with
//. known structure and returns the value at the given path. If for some
//. reason the path does not exist, a type error is thrown.
//.
//. For accessing property paths of uncertain objects, use [`gets`](#gets)
//. instead.
//.
//. ```javascript
//. > S.props (['a', 'b', 'c']) ({a: {b: {c: 1}}})
//. 1
//. ```

import $ from 'sanctuary-def';
import show from 'sanctuary-show';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('props')
  ({})
  ([$.Array ($.String), a, b])
  (path => x =>
     path.reduce ((x, key) => {
       if (x != null) {
         const obj = Object (x);
         if (key in obj) return obj[key];
       }
       throw new TypeError (
         `‘props’ expected object to have a property at ${show (path)}; ${show (x)} does not`
       );
     }, x));
