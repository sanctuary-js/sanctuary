//# mapLeft :: Bifunctor f => (a -> b) -> f a c -> f b c
//.
//. Curried version of [`Z.mapLeft`][]. Maps the given function over the left
//. side of a Bifunctor.
//.
//. ```javascript
//. > S.mapLeft (S.toUpper) (S.Pair ('foo') (64))
//. Pair ('FOO') (64)
//.
//. > S.mapLeft (S.toUpper) (S.Left ('foo'))
//. Left ('FOO')
//.
//. > S.mapLeft (S.toUpper) (S.Right (64))
//. Right (64)
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, p} = makeTypeVars ({a: 0, b: 0, c: 0, p: 2});

export default def
  ('mapLeft')
  ({p: [Z.Bifunctor]})
  ([$.Fn (a) (b), p (a) (c), p (b) (c)])
  (f => bifunctor => Z.mapLeft (f, bifunctor));
