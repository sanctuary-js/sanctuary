'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('mapLeft', () => {

  eq (typeof S.mapLeft) ('function');
  eq (S.mapLeft.length) (1);
  eq (S.show (S.mapLeft)) ('mapLeft :: Bifunctor p => (a -> b) -> p a c -> p b c');

  eq (S.mapLeft (S.toUpper) (S.Left ('xxx'))) (S.Left ('XXX'));
  eq (S.mapLeft (S.toUpper) (S.Right (1000))) (S.Right (1000));

});
