'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('snd', function() {

  eq (typeof S.snd) ('function');
  eq (S.snd.length) (1);
  eq (S.show (S.snd)) ('snd :: Pair a b -> b');

  eq (S.snd (S.Pair ('foo') (42))) (42);

});
