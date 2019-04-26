'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('or', () => {

  eq (S.show (S.or)) ('or :: Boolean -> Boolean -> Boolean');

  eq (S.or (false) (false)) (false);
  eq (S.or (false) (true)) (true);
  eq (S.or (true) (false)) (true);
  eq (S.or (true) (true)) (true);

});
