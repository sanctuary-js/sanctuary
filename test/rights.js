'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('rights', function() {

  eq(typeof S.rights, 'function');
  eq(S.rights.length, 1);
  eq(S.rights.toString(), 'rights :: Array (Either a b) -> Array b');

  eq(S.rights([]), []);
  eq(S.rights([S.Left('a'), S.Left('b')]), []);
  eq(S.rights([S.Left('a'), S.Right(1)]), [1]);
  eq(S.rights([S.Right(2), S.Left('b')]), [2]);
  eq(S.rights([S.Right(2), S.Right(1)]), [2, 1]);

});
