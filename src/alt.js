//# alt :: Alt f => f a -> f a -> f a
//.
//. Curried version of [`Z.alt`][] with arguments flipped to facilitate
//. partial application.
//.
//. ```javascript
//. > S.alt (S.Just ('default')) (S.Nothing)
//. Just ('default')
//.
//. > S.alt (S.Just ('default')) (S.Just ('hello'))
//. Just ('hello')
//.
//. > S.alt (S.Right (0)) (S.Left ('X'))
//. Right (0)
//.
//. > S.alt (S.Right (0)) (S.Right (1))
//. Right (1)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('alt')
  ({f: [Z.Alt]})
  ([f (a), f (a), f (a)])
  (y => x => Z.alt (x, y));
