'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('and', () => {

  eq (String (S.and), 'and :: Boolean -> Boolean -> Boolean');

  eq (S.and (false) (false), false);
  eq (S.and (false) (true), false);
  eq (S.and (true) (false), false);
  eq (S.and (true) (true), true);

});
