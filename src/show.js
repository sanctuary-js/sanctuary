//# show :: Any -> String
//.
//. Alias of [`show`][].
//.
//. ```javascript
//. > S.show (-0)
//. '-0'
//.
//. > S.show (['foo', 'bar', 'baz'])
//. '["foo", "bar", "baz"]'
//.
//. > S.show ({x: 1, y: 2, z: 3})
//. '{"x": 1, "y": 2, "z": 3}'
//.
//. > S.show (S.Left (S.Right (S.Just (S.Nothing))))
//. 'Left (Right (Just (Nothing)))'
//. ```

import $ from 'sanctuary-def';
import show from 'sanctuary-show';

import def from './internal/def.js';

export default def
  ('show')
  ({})
  ([$.Any, $.String])
  (show);
