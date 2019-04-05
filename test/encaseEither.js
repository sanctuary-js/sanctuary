'use strict';

const S = require ('..');

const area = require ('./internal/area');
const eq = require ('./internal/eq');
const factorial = require ('./internal/factorial');
const rem = require ('./internal/rem');


test ('encaseEither', () => {

  eq (typeof S.encaseEither) ('function');
  eq (S.encaseEither.length) (1);
  eq (S.show (S.encaseEither)) ('encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r');

  //    safeFactorial :: Number -> Either Error Number
  const safeFactorial = S.encaseEither (S.I) (factorial);

  eq (safeFactorial (5)) (S.Right (120));
  eq (safeFactorial (-1)) (S.Left (new Error ('Cannot determine factorial of negative number')));
  eq (S.mapLeft (S.prop ('message')) (safeFactorial (-1)))
     (S.Left ('Cannot determine factorial of negative number'));

  //    safeRem :: Number -> Number -> Either Error Number
  const safeRem = S.compose (S.encaseEither (S.I)) (rem);

  eq (safeRem (42) (5)) (S.Right (2));
  eq (safeRem (42) (0)) (S.Left (new Error ('Cannot divide by zero')));
  eq (S.mapLeft (S.prop ('message')) (safeRem (42) (0)))
     (S.Left ('Cannot divide by zero'));

  //    safeArea :: Number -> Number -> Number -> Either Error Number
  const safeArea = S.compose (S.compose (S.encaseEither (S.I))) (area);

  eq (safeArea (3) (4) (5)) (S.Right (6));
  eq (safeArea (2) (2) (5)) (S.Left (new Error ('Impossible triangle')));
  eq (S.mapLeft (S.prop ('message')) (safeArea (2) (2) (5)))
     (S.Left ('Impossible triangle'));

});
