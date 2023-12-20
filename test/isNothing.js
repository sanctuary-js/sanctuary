'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('isNothing', () => {

  eq (String (S.isNothing), 'isNothing :: Maybe a -> Boolean');

  eq (S.isNothing (S.Nothing), true);
  eq (S.isNothing (S.Just (42)), false);

});
