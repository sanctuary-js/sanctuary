'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('maybe', () => {

  eq (typeof S.maybe) ('function');
  eq (S.maybe.length) (1);
  eq (S.show (S.maybe)) ('maybe :: b -> (a -> b) -> Maybe a -> b');

  eq (S.maybe (0) (Math.sqrt) (S.Nothing)) (0);
  eq (S.maybe (0) (Math.sqrt) (S.Just (9))) (3);

});
