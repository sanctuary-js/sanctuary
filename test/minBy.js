'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('minBy', () => {

  eq (S.show (S.minBy)) ('minBy :: Ord b => (a -> b) -> (a -> a -> a) -> a -> a -> a');

  eq (S.minBy (S.fst) (S.K) (S.Pair ('foo') (1)) (S.Pair ('bar') (2))) (S.Pair ('bar') (2));
  eq (S.minBy (S.snd) (S.K) (S.Pair ('foo') (1)) (S.Pair ('bar') (2))) (S.Pair ('foo') (1));

  eq (S.minBy (S.head) (x => y => x) ([1]) ([1, 2, 3])) ([1]);
  eq (S.minBy (S.head) (x => y => y) ([1]) ([1, 2, 3])) ([1, 2, 3]);

});
