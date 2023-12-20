'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('either', () => {

  eq (String (S.either), 'either :: (a -> c) -> (b -> c) -> Either a b -> c');

  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Left ('abc')), 3);
  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Right (256)), 16);

});
