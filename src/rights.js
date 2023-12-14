//# rights :: (Filterable f, Functor f) => f (Either a b) -> f b
//.
//. Discards each element that is a Left, and unwraps each element that is
//. a Right.
//.
//. See also [`lefts`](#lefts).
//.
//. ```javascript
//. > S.rights ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
//. [20, 10]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import isRight from './isRight.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('rights')
  ({f: [Z.Filterable, Z.Functor]})
  ([f ($.Either (a) (b)), f (b)])
  (eithers => Z.map (right => right.value, Z.filter (isRight, eithers)));
