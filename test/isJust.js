'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('isJust', () => {

  eq (String (S.isJust), 'isJust :: Maybe a -> Boolean');

  eq (S.isJust (S.Nothing), false);
  eq (S.isJust (S.Just (42)), true);

});
