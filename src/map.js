//# map :: Functor f => (a -> b) -> f a -> f b
//.
//. Curried version of [`Z.map`][].
//.
//. ```javascript
//. > S.map (Math.sqrt) ([1, 4, 9])
//. [1, 2, 3]
//.
//. > S.map (Math.sqrt) ({x: 1, y: 4, z: 9})
//. {x: 1, y: 2, z: 3}
//.
//. > S.map (Math.sqrt) (S.Just (9))
//. Just (3)
//.
//. > S.map (Math.sqrt) (S.Right (9))
//. Right (3)
//.
//. > S.map (Math.sqrt) (S.Pair (99980001) (99980001))
//. Pair (99980001) (9999)
//. ```
//.
//. Replacing `Functor f => f` with `Function x` produces the B combinator
//. from combinatory logic (i.e. [`compose`](#compose)):
//.
//.     Functor f => (a -> b) -> f a -> f b
//.     (a -> b) -> Function x a -> Function x b
//.     (a -> b) -> (x -> a) -> (x -> b)
//.     (a -> b) -> (x -> a) -> x -> b
//.     (b -> c) -> (a -> b) -> a -> c
//.
//. ```javascript
//. > S.map (Math.sqrt) (S.add (1)) (99)
//. 10
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('map')
  ({f: [Z.Functor]})
  ([$.Fn (a) (b), f (a), f (b)])
  (f => functor => Z.map (f, functor));
