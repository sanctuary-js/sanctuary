//# elem_ :: (Setoid a, Foldable f) => f a -> a -> Boolean
//.
//. Variant of [`elem`](#elem) with arguments flipped.
//.
//. ```javascript
//. > S.filter (S.elem_ (['yes', 'oui', 'ja'])) (['yes', 'no'])
//. ['yes']
//.
//. > S.filter (S.elem_ (['yes', 'oui', 'ja'])) (['oui', 'non'])
//. ['oui']
//.
//. > S.filter (S.elem_ (['yes', 'oui', 'ja'])) (['ja', 'nein'])
//. ['ja']
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('elem_')
  ({a: [Z.Setoid], f: [Z.Foldable]})
  ([f (a), a, $.Boolean])
  (foldable => x => Z.elem (x, foldable));
