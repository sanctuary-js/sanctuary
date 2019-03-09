'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Just', () => {

  eq (typeof S.Just) ('function');
  eq (S.Just.length) (1);
  eq (S.show (S.Just)) ('Just :: a -> Maybe a');

  eq (S.Just (42)) (S.Just (42));

});
