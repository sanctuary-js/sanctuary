'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('match', function() {

  eq(typeof S.match, 'function');
  eq(S.match.length, 2);
  eq(S.match.toString(), 'match :: RegExp -> String -> Maybe (Array (Maybe String))');

  eq(S.match(/abcd/, 'abcdefg'), S.Just([S.Just('abcd')]));
  eq(S.match(/[a-z]a/g, 'bananas'), S.Just([S.Just('ba'), S.Just('na'), S.Just('na')]));
  eq(S.match(/(good)?bye/, 'goodbye'), S.Just([S.Just('goodbye'), S.Just('good')]));
  eq(S.match(/(good)?bye/, 'bye'), S.Just([S.Just('bye'), S.Nothing]));
  eq(S.match(/zzz/, 'abcdefg'), S.Nothing);

});
