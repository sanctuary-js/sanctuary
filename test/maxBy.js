'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('maxBy', () => {

  eq (S.show (S.maxBy)) ('maxBy :: Ord b => (a -> b) -> (a -> a -> a) -> a -> a -> a');

  eq (S.maxBy (S.fst) (S.K) (S.Pair ('foo') (1)) (S.Pair ('bar') (2))) (S.Pair ('foo') (1));
  eq (S.maxBy (S.snd) (S.K) (S.Pair ('foo') (1)) (S.Pair ('bar') (2))) (S.Pair ('bar') (2));

  eq (S.maxBy (S.head) (x => y => x) ([1]) ([1, 2, 3])) ([1]);
  eq (S.maxBy (S.head) (x => y => y) ([1]) ([1, 2, 3])) ([1, 2, 3]);

});
