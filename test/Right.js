'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Right', () => {

  eq (typeof S.Right) ('function');
  eq (S.Right.length) (1);
  eq (S.show (S.Right)) ('Right :: b -> Either a b');

  eq (S.Right (42)) (S.Right (42));

});
