'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Pair', () => {

  eq (String (S.Pair)) ('Pair :: a -> b -> Pair a b');

  eq (S.Pair ('foo') (42)) (S.Pair ('foo') (42));

});
