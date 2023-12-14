//# lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
//.
//. Promotes a curried ternary function to a function that operates on three
//. [Apply][]s.
//.
//. ```javascript
//. > S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Just ([1, 2, 3]))
//. Just (6)
//.
//. > S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Nothing)
//. Nothing
//. ```
//.
//. Replacing `Apply f => f` with `Function x` produces a combinator that
//. applies the three given unary functions to the given input value, then
//. applies the given ternary function to the three intermediate results
//. to determine the final result:
//.
//.     Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
//.     (a -> b -> c -> d) -> Function x a -> Function x b -> Function x c -> Function x d
//.     (a -> b -> c -> d) -> (x -> a) -> (x -> b) -> (x -> c) -> (x -> d)
//.     (a -> b -> c -> d) -> (x -> a) -> (x -> b) -> (x -> c) -> x -> d
//.     (b -> c -> d -> e) -> (a -> b) -> (a -> c) -> (a -> d) -> a -> e
//.
//. ```javascript
//. > S.lift3 (x => y => z => ({x, y, z}))
//. .         (s => s + '.')
//. .         (s => s + '?')
//. .         (s => s + '!')
//. .         ('Hello')
//. {x: 'Hello.', y: 'Hello?', z: 'Hello!'}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, d, f} = makeTypeVars ({a: 0, b: 0, c: 0, d: 0, f: 1});

export default def
  ('lift3')
  ({f: [Z.Apply]})
  ([$.Fn (a) ($.Fn (b) ($.Fn (c) (d))), f (a), f (b), f (c), f (d)])
  (f => x => y => z => Z.lift3 (f, x, y, z));
