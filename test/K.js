'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('K', () => {

  eq (String (S.K)) ('K :: a -> b -> a');

  eq (S.K (21) ([])) (21);
  eq (S.K (42) (null)) (42);
  eq (S.K (84) (undefined)) (84);

});
