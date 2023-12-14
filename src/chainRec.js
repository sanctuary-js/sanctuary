//# chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b
//.
//. Performs a [`chain`](#chain)-like computation with constant stack usage.
//. Similar to [`Z.chainRec`][], but curried and more convenient due to the
//. use of the Either type to indicate completion (via a Right).
//.
//. ```javascript
//. > S.chainRec (Array)
//. .            (s => s.length === 2 ? S.map (S.Right) ([s + '!', s + '?'])
//. .                                 : S.map (S.Left) ([s + 'o', s + 'n']))
//. .            ('')
//. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import either from './either~.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, m} = makeTypeVars ({a: 0, b: 0, m: 1});

export default def
  ('chainRec')
  ({m: [Z.ChainRec]})
  ([TypeRep (m (b)), $.Fn (a) (m ($.Either (a) (b))), a, m (b)])
  (typeRep => f => {
     const step = (next, done, x) => Z.map (either (next) (done), f (x));
     return x => Z.chainRec (typeRep, step, x);
   });
