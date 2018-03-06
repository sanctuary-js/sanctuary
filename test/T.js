'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('T', function() {

  eq (typeof S.T) ('function');
  eq (S.T.length) (1);
  eq (String (S.T)) ('T :: a -> (a -> b) -> b');

  eq (S.T ('!') (S.concat ('foo'))) ('foo!');
  eq (S.T ('!') (S.concat ('bar'))) ('bar!');

});
