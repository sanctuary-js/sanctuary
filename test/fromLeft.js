'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('fromLeft', () => {

  eq (String (S.fromLeft), 'fromLeft :: a -> Either a b -> a');

  eq (S.fromLeft ('abc') (S.Left ('xyz')), 'xyz');
  eq (S.fromLeft ('abc') (S.Right (123)), 'abc');

});
