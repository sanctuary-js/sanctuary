'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('lens', () => {

  eq (S.show (S.lens)) ('lens :: (s -> a) -> (a -> s -> s) -> Any');

});
