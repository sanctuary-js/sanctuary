'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('isRight', () => {

  eq (String (S.isRight), 'isRight :: Either a b -> Boolean');

  eq (S.isRight (S.Left (42)), false);
  eq (S.isRight (S.Right (42)), true);

});
