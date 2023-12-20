'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('zipWith', () => {

  eq (String (S.zipWith), 'zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c');

  eq (S.zipWith (x => y => x + y) (['a', 'b']) (['x', 'y', 'z']), ['ax', 'by']);
  eq (S.zipWith (x => y => [x, y]) ([1, 3, 5]) ([2, 4]), [[1, 2], [3, 4]]);

});
