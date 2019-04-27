'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('not', () => {

  eq (S.show (S.not)) ('not :: Boolean -> Boolean');

  eq (S.not (false)) (true);
  eq (S.not (true)) (false);

});
