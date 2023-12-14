//# ap :: Apply f => f (a -> b) -> f a -> f b
//.
//. Curried version of [`Z.ap`][].
//.
//. ```javascript
//. > S.ap ([Math.sqrt, x => x * x]) ([1, 4, 9, 16, 25])
//. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
//.
//. > S.ap ({x: Math.sqrt, y: S.add (1), z: S.sub (1)}) ({w: 4, x: 4, y: 4})
//. {x: 2, y: 5}
//.
//. > S.ap (S.Just (Math.sqrt)) (S.Just (64))
//. Just (8)
//. ```
//.
//. Replacing `Apply f => f` with `Function x` produces the S combinator
//. from combinatory logic:
//.
//.     Apply f => f (a -> b) -> f a -> f b
//.     Function x (a -> b) -> Function x a -> Function x b
//.     (x -> (a -> b)) -> (x -> a) -> (x -> b)
//.     (x -> a -> b) -> (x -> a) -> x -> b
//.     (a -> b -> c) -> (a -> b) -> a -> c
//.
//. ```javascript
//. > S.ap (s => n => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('Haskell')
//. 'Hask'
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('ap')
  ({f: [Z.Apply]})
  ([f ($.Fn (a) (b)), f (a), f (b)])
  (applyF => applyX => Z.ap (applyF, applyX));
