'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var factorial = require ('./internal/factorial');


test ('encaseEither', function() {

  eq (typeof S.encaseEither) ('function');
  eq (S.encaseEither.length) (1);
  eq (String (S.encaseEither)) ('encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r');

  eq (S.encaseEither (S.I) (factorial) (5)) (S.Right (120));
  eq (S.encaseEither (S.I) (factorial) (-1)) (S.Left (new Error ('Cannot determine factorial of negative number')));
  eq (S.encaseEither (S.prop ('message')) (factorial) (-1)) (S.Left ('Cannot determine factorial of negative number'));

});
