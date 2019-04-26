'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('zipWith', () => {

  eq (S.show (S.zipWith)) ('zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c');

  eq (S.zipWith (x => y => x + y) (['a', 'b']) (['x', 'y', 'z'])) (['ax', 'by']);
  eq (S.zipWith (x => y => [x, y]) ([1, 3, 5]) ([2, 4])) ([[1, 2], [3, 4]]);

});
