//# fromLeft :: a -> Either a b -> a
//.
//. Takes a default value and an Either, and returns the Left value
//. if the Either is a Left; the default value otherwise.
//.
//. See also [`either`](#either) and [`fromRight`](#fromRight).
//.
//. ```javascript
//. > S.fromLeft ('abc') (S.Left ('xyz'))
//. 'xyz'
//.
//. > S.fromLeft ('abc') (S.Right (123))
//. 'abc'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('fromLeft')
  ({})
  ([a, $.Either (a) (b), a])
  (right => either => either.isLeft ? either.value : right);
