'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('justToRight', () => {

  eq (S.show (S.justToRight)) ('justToRight :: a -> Maybe b -> Either a b');

  eq (S.justToRight ('error msg') (S.Nothing)) (S.Left ('error msg'));
  eq (S.justToRight ('error msg') (S.Just (42))) (S.Right (42));

});
