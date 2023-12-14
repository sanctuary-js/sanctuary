//# intercalate :: (Monoid m, Foldable f) => m -> f m -> m
//.
//. Curried version of [`Z.intercalate`][]. Concatenates the elements of
//. the given structure, separating each pair of adjacent elements with
//. the given separator.
//.
//. See also [`joinWith`](#joinWith).
//.
//. ```javascript
//. > S.intercalate (', ') ([])
//. ''
//.
//. > S.intercalate (', ') (['foo', 'bar', 'baz'])
//. 'foo, bar, baz'
//.
//. > S.intercalate (', ') (Nil)
//. ''
//.
//. > S.intercalate (', ') (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))
//. 'foo, bar, baz'
//.
//. > S.intercalate ([0, 0, 0]) ([])
//. []
//.
//. > S.intercalate ([0, 0, 0]) ([[1], [2, 3], [4, 5, 6], [7, 8], [9]])
//. [1, 0, 0, 0, 2, 3, 0, 0, 0, 4, 5, 6, 0, 0, 0, 7, 8, 0, 0, 0, 9]
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('intercalate')
  ({a: [Z.Monoid], f: [Z.Foldable]})
  ([a, f (a), a])
  (separator => foldable => Z.intercalate (separator, foldable));
