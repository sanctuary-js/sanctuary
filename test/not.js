'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('not', () => {

  eq (String (S.not), 'not :: Boolean -> Boolean');

  eq (S.not (false), true);
  eq (S.not (true), false);

});
