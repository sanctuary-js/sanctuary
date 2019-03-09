'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('apFirst', () => {

  eq (typeof S.apFirst) ('function');
  eq (S.apFirst.length) (1);
  eq (S.show (S.apFirst)) ('apFirst :: Apply f => f a -> f b -> f a');

  eq (S.apFirst ([1, 2]) ([3, 4])) ([1, 1, 2, 2]);
  eq (S.apFirst (S.Just (1)) (S.Just (2))) (S.Just (1));

});
