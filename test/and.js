'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('and', () => {

  eq (S.show (S.and)) ('and :: Boolean -> Boolean -> Boolean');

  eq (S.and (false) (false)) (false);
  eq (S.and (false) (true)) (false);
  eq (S.and (true) (false)) (false);
  eq (S.and (true) (true)) (true);

});
