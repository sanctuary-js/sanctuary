'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('T', () => {

  eq (String (S.T)) ('T :: a -> (a -> b) -> b');

  eq (S.T ('!') (S.concat ('foo'))) ('foo!');
  eq (S.T ('!') (S.concat ('bar'))) ('bar!');

});
