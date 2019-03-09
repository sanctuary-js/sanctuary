'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('not', () => {

  eq (typeof S.not) ('function');
  eq (S.not.length) (1);
  eq (S.show (S.not)) ('not :: Boolean -> Boolean');

  eq (S.not (false)) (true);
  eq (S.not (true)) (false);

});
