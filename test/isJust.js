'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('isJust', () => {

  eq (String (S.isJust)) ('isJust :: Maybe a -> Boolean');

  eq (S.isJust (S.Nothing)) (false);
  eq (S.isJust (S.Just (42))) (true);

});
