'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('fromRight', () => {

  eq (String (S.fromRight), 'fromRight :: b -> Either a b -> b');

  eq (S.fromRight (123) (S.Right (789)), 789);
  eq (S.fromRight (123) (S.Left ('abc')), 123);

});
