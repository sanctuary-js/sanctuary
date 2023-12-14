//# zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c
//.
//. Returns the result of combining, pairwise, the given arrays using the
//. given binary function. The length of the resulting array is equal to the
//. length of the shorter input array.
//.
//. See also [`zip`](#zip).
//.
//. ```javascript
//. > S.zipWith (a => b => a + b) (['a', 'b']) (['x', 'y', 'z'])
//. ['ax', 'by']
//.
//. > S.zipWith (a => b => [a, b]) ([1, 3, 5]) ([2, 4])
//. [[1, 2], [3, 4]]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c} = makeTypeVars ({a: 0, b: 0, c: 0});

export default
def ('zipWith')
    ({})
    ([$.Fn (a) ($.Fn (b) (c)), $.Array (a), $.Array (b), $.Array (c)])
    (f => xs => ys => {
       const result = new Array (Math.min (xs.length, ys.length));
       for (let idx = 0; idx < result.length; idx += 1) {
         result[idx] = f (xs[idx]) (ys[idx]);
       }
       return result;
     });
