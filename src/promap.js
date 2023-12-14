//# promap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
//.
//. Curried version of [`Z.promap`][].
//.
//. ```javascript
//. > S.promap (Math.abs) (S.add (1)) (Math.sqrt) (-100)
//. 11
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, d, p} = makeTypeVars ({a: 0, b: 0, c: 0, d: 0, p: 2});

export default def
  ('promap')
  ({p: [Z.Profunctor]})
  ([$.Fn (a) (b), $.Fn (c) (d), p (b) (c), p (a) (d)])
  (f => g => profunctor => Z.promap (f, g, profunctor));
