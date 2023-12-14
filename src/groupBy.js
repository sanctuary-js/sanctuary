//# groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)
//.
//. Splits its array argument into an array of arrays of equal,
//. adjacent elements. Equality is determined by the function
//. provided as the first argument. Its behaviour can be surprising
//. for functions that aren't reflexive, transitive, and symmetric
//. (see [equivalence][] relation).
//.
//. Properties:
//.
//.   - `forall f :: a -> a -> Boolean, xs :: Array a.
//.      S.join (S.groupBy (f) (xs)) = xs`
//.
//. ```javascript
//. > S.groupBy (S.equals) ([1, 1, 2, 1, 1])
//. [[1, 1], [2], [1, 1]]
//.
//. > S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4])
//. [[2], [-3, 3, 3, 3], [4, -4], [4]]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('groupBy')
  ({})
  ([$.Fn (a) ($.Predicate (a)), $.Array (a), $.Array ($.Array (a))])
  (f => xs => {
     if (xs.length === 0) return [];
     let x0 = xs[0];           // :: a
     let active = [x0];        // :: Array a
     const result = [active];  // :: Array (Array a)
     for (let idx = 1; idx < xs.length; idx += 1) {
       const x = xs[idx];
       if (f (x0) (x)) active.push (x); else result.push (active = [x0 = x]);
     }
     return result;
   });
