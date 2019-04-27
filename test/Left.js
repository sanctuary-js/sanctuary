'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('Left', () => {

  eq (S.show (S.Left)) ('Left :: a -> Either a b');

  eq (S.Left (42)) (S.Left (42));

});
