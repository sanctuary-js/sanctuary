'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('toMaybe', () => {

  eq (S.show (S.toMaybe)) ('toMaybe :: a -> Maybe a');

  eq (S.toMaybe (null)) (S.Nothing);
  eq (S.toMaybe (undefined)) (S.Nothing);
  eq (S.toMaybe (0)) (S.Just (0));
  eq (S.toMaybe (false)) (S.Just (false));

});
