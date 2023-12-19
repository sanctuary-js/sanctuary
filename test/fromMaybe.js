'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('fromMaybe', () => {

  eq (String (S.fromMaybe)) ('fromMaybe :: a -> Maybe a -> a');

  eq (S.fromMaybe (0) (S.Nothing)) (0);
  eq (S.fromMaybe (0) (S.Just (42))) (42);

});
