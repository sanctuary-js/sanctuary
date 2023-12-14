//# lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
//.
//. Promotes a curried binary function to a function that operates on two
//. [Apply][]s.
//.
//. ```javascript
//. > S.lift2 (S.add) (S.Just (2)) (S.Just (3))
//. Just (5)
//.
//. > S.lift2 (S.add) (S.Just (2)) (S.Nothing)
//. Nothing
//.
//. > S.lift2 (S.and) (S.Just (true)) (S.Just (true))
//. Just (true)
//.
//. > S.lift2 (S.and) (S.Just (true)) (S.Just (false))
//. Just (false)
//. ```
//.
//. Replacing `Apply f => f` with `Function x` produces a combinator known
//. by various names including [`apply2way`][] and [`converge`][]:
//.
//.     Apply f => (a -> b -> c) -> f a -> f b -> f c
//.     (a -> b -> c) -> Function x a -> Function x b -> Function x c
//.     (a -> b -> c) -> (x -> a) -> (x -> b) -> (x -> c)
//.     (a -> b -> c) -> (x -> a) -> (x -> b) -> x -> c
//.     (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
//.
//. ```javascript
//. > S.lift2 (x => y => ({x, y}))
//. .         (s => s + '.')
//. .         (s => s + '?')
//. .         ('Hello')
//. {x: 'Hello.', y: 'Hello?'}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, f} = makeTypeVars ({a: 0, b: 0, c: 0, f: 1});

export default def
  ('lift2')
  ({f: [Z.Apply]})
  ([$.Fn (a) ($.Fn (b) (c)), f (a), f (b), f (c)])
  (f => x => y => Z.lift2 (f, x, y));
