//# lefts :: (Filterable f, Functor f) => f (Either a b) -> f a
//.
//. Discards each element that is a Right, and unwraps each element that is
//. a Left.
//.
//. See also [`rights`](#rights).
//.
//. ```javascript
//. > S.lefts ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
//. ['foo', 'bar']
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import isLeft from './isLeft.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('lefts')
  ({f: [Z.Filterable, Z.Functor]})
  ([f ($.Either (a) (b)), f (a)])
  (eithers => Z.map (left => left.value, Z.filter (isLeft, eithers)));
