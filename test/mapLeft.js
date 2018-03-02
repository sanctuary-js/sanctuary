'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('mapLeft', function() {

  eq(typeof S.mapLeft, 'function');
  eq(S.mapLeft.length, 2);
  eq(S.mapLeft.toString(), 'mapLeft :: Bifunctor p => (a -> b) -> p a c -> p b c');

  eq(S.mapLeft(S.toUpper, S.Left('xxx')), S.Left('XXX'));
  eq(S.mapLeft(S.toUpper, S.Right(1000)), S.Right(1000));

});
