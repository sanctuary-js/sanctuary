//# max :: Ord a => a -> a -> a
//.
//. Returns the larger of its two arguments (according to [`Z.lte`][]).
//.
//. See also [`min`](#min).
//.
//. ```javascript
//. > S.max (10) (2)
//. 10
//.
//. > S.max (new Date ('1999-12-31')) (new Date ('2000-01-01'))
//. new Date ('2000-01-01')
//.
//. > S.max ('10') ('2')
//. '2'
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('max')
  ({a: [Z.Ord]})
  ([a, a, a])
  (x => y => Z.max (x, y));
