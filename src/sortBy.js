//# sortBy :: (Ord b, Applicative m, Foldable m, Monoid (m a)) => (a -> b) -> m a -> m a
//.
//. Performs a [stable sort][] of the elements of the given structure, using
//. [`Z.lte`][] to compare the values produced by applying the given function
//. to each element of the structure.
//.
//. Properties:
//.
//.   - `S.sortBy (f) (S.sortBy (f) (m)) = S.sortBy (f) (m)` (idempotence)
//.
//. See also [`sort`](#sort).
//.
//. ```javascript
//. > S.sortBy (S.prop ('rank')) ([
//. .   {rank: 7, suit: 'spades'},
//. .   {rank: 5, suit: 'hearts'},
//. .   {rank: 2, suit: 'hearts'},
//. .   {rank: 5, suit: 'spades'},
//. . ])
//. [ {rank: 2, suit: 'hearts'},
//. . {rank: 5, suit: 'hearts'},
//. . {rank: 5, suit: 'spades'},
//. . {rank: 7, suit: 'spades'} ]
//.
//. > S.sortBy (S.prop ('suit')) ([
//. .   {rank: 7, suit: 'spades'},
//. .   {rank: 5, suit: 'hearts'},
//. .   {rank: 2, suit: 'hearts'},
//. .   {rank: 5, suit: 'spades'},
//. . ])
//. [ {rank: 5, suit: 'hearts'},
//. . {rank: 2, suit: 'hearts'},
//. . {rank: 7, suit: 'spades'},
//. . {rank: 5, suit: 'spades'} ]
//. ```
//.
//. If descending order is desired, one may use [`Descending`][]:
//.
//. ```javascript
//. > S.sortBy (Descending) ([83, 97, 110, 99, 116, 117, 97, 114, 121])
//. [121, 117, 116, 114, 110, 99, 97, 97, 83]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, m} = makeTypeVars ({a: 0, b: 0, m: 1});

export default def
  ('sortBy')
  ({b: [Z.Ord], m: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([$.Fn (a) (b), m (a), m (a)])
  (f => foldable => Z.sortBy (f, foldable));
