//# zip :: Array a -> Array b -> Array (Pair a b)
//.
//. Returns an array of pairs of corresponding elements from the given
//. arrays. The length of the resulting array is equal to the length of
//. the shorter input array.
//.
//. See also [`zipWith`](#zipWith).
//.
//. ```javascript
//. > S.zip (['a', 'b']) (['x', 'y', 'z'])
//. [Pair ('a') ('x'), Pair ('b') ('y')]
//.
//. > S.zip ([1, 3, 5]) ([2, 4])
//. [Pair (1) (2), Pair (3) (4)]
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import zipWith from './zipWith.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default
def ('zip')
    ({})
    ([$.Array (a), $.Array (b), $.Array ($.Pair (a) (b))])
    (zipWith (Pair_));
