//# bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d
//.
//. Curried version of [`Z.bimap`][].
//.
//. ```javascript
//. > S.bimap (S.toUpper) (Math.sqrt) (S.Pair ('foo') (64))
//. Pair ('FOO') (8)
//.
//. > S.bimap (S.toUpper) (Math.sqrt) (S.Left ('foo'))
//. Left ('FOO')
//.
//. > S.bimap (S.toUpper) (Math.sqrt) (S.Right (64))
//. Right (8)
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, d, p} = makeTypeVars ({a: 0, b: 0, c: 0, d: 0, p: 2});

export default def
  ('bimap')
  ({p: [Z.Bifunctor]})
  ([$.Fn (a) (b), $.Fn (c) (d), p (a) (c), p (b) (d)])
  (f => g => bifunctor => Z.bimap (f, g, bifunctor));
