'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('snd', () => {

  eq (typeof S.snd) ('function');
  eq (S.snd.length) (1);
  eq (S.show (S.snd)) ('snd :: Pair a b -> b');

  eq (S.snd (S.Pair ('foo') (42))) (42);

});
