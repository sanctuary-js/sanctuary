//# flip :: Functor f => f (a -> b) -> a -> f b
//.
//. Curried version of [`Z.flip`][]. Maps over the given functions, applying
//. each to the given value.
//.
//. Replacing `Functor f => f` with `Function x` produces the C combinator
//. from combinatory logic:
//.
//.     Functor f => f (a -> b) -> a -> f b
//.     Function x (a -> b) -> a -> Function x b
//.     (x -> (a -> b)) -> a -> (x -> b)
//.     (x -> a -> b) -> a -> x -> b
//.     (a -> b -> c) -> b -> a -> c
//.
//. ```javascript
//. > S.flip (S.concat) ('!') ('foo')
//. 'foo!'
//.
//. > S.flip ([Math.floor, Math.ceil]) (1.5)
//. [1, 2]
//.
//. > S.flip ({floor: Math.floor, ceil: Math.ceil}) (1.5)
//. {floor: 1, ceil: 2}
//.
//. > S.flip (Cons (Math.floor) (Cons (Math.ceil) (Nil))) (1.5)
//. Cons (1) (Cons (2) (Nil))
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('flip')
  ({f: [Z.Functor]})
  ([f ($.Fn (a) (b)), a, f (b)])
  (functor => x => Z.flip (functor, x));
