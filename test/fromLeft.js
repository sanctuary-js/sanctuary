'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('fromLeft', () => {

  eq (S.show (S.fromLeft)) ('fromLeft :: a -> Either a b -> a');

  eq (S.fromLeft ('abc') (S.Left ('xyz'))) ('xyz');
  eq (S.fromLeft ('abc') (S.Right (123))) ('abc');

});
