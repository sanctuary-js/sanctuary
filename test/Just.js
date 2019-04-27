'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Just', () => {

  eq (S.show (S.Just)) ('Just :: a -> Maybe a');

  eq (S.Just (42)) (S.Just (42));

});
