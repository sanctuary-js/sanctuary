'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('justToLeft', () => {

  eq (S.show (S.justToLeft)) ('justToLeft :: b -> Maybe a -> Either a b');

  eq (S.justToLeft ('success msg') (S.Nothing)) (S.Right ('success msg'));
  eq (S.justToLeft ('success msg') (S.Just (42))) (S.Left (42));

});
