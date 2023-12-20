'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('K', () => {

  eq (String (S.K), 'K :: a -> b -> a');

  eq (S.K (21) ([]), 21);
  eq (S.K (42) (null), 42);
  eq (S.K (84) (undefined), 84);

});
