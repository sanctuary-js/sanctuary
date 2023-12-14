//# equals :: Setoid a => a -> a -> Boolean
//.
//. Curried version of [`Z.equals`][] that requires two arguments of the
//. same type.
//.
//. To compare values of different types first use [`create`](#create) to
//. create a Sanctuary module with type checking disabled, then use that
//. module's `equals` function.
//.
//. ```javascript
//. > S.equals (0) (-0)
//. true
//.
//. > S.equals (NaN) (NaN)
//. true
//.
//. > S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 3]))
//. true
//.
//. > S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 4]))
//. false
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('equals')
  ({a: [Z.Setoid]})
  ([a, a, $.Boolean])
  (x => y => Z.equals (x, y));
