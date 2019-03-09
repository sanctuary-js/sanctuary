'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Left', () => {

  eq (typeof S.Left) ('function');
  eq (S.Left.length) (1);
  eq (S.show (S.Left)) ('Left :: a -> Either a b');

  eq (S.Left (42)) (S.Left (42));

});
