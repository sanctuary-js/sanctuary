//# min :: Ord a => a -> a -> a
//.
//. Returns the smaller of its two arguments (according to [`Z.lte`][]).
//.
//. See also [`max`](#max).
//.
//. ```javascript
//. > S.min (10) (2)
//. 2
//.
//. > S.min (new Date ('1999-12-31')) (new Date ('2000-01-01'))
//. new Date ('1999-12-31')
//.
//. > S.min ('10') ('2')
//. '10'
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('min')
  ({a: [Z.Ord]})
  ([a, a, a])
  (x => y => Z.min (x, y));
