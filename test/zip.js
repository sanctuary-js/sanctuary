'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('zip', () => {

  eq (S.show (S.zip)) ('zip :: Array a -> Array b -> Array (Pair a b)');

  eq (S.zip (['a', 'b']) (['x', 'y', 'z']))
     ([S.Pair ('a') ('x'), S.Pair ('b') ('y')]);
  eq (S.zip ([1, 3, 5]) ([2, 4]))
     ([S.Pair (1) (2), S.Pair (3) (4)]);

});
