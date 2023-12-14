//# extend :: Extend w => (w a -> b) -> w a -> w b
//.
//. Curried version of [`Z.extend`][].
//.
//. ```javascript
//. > S.extend (S.joinWith ('')) (['x', 'y', 'z'])
//. ['xyz', 'yz', 'z']
//.
//. > S.extend (f => f ([3, 4])) (S.reverse) ([1, 2])
//. [4, 3, 2, 1]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, w} = makeTypeVars ({a: 0, b: 0, w: 1});

export default def
  ('extend')
  ({w: [Z.Extend]})
  ([$.Fn (w (a)) (b), w (a), w (b)])
  (f => e => Z.extend (f, e));
