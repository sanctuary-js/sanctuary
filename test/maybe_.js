'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');

const factorial = require ('./internal/factorial');


test ('maybe_', () => {

  eq (String (S.maybe_), 'maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b');

  eq (S.maybe_ (() => factorial (10)) (Math.sqrt) (S.Nothing), 3628800);
  eq (S.maybe_ (() => factorial (10)) (Math.sqrt) (S.Just (9)), 3);

  let count = 0;
  eq (S.maybe_ (() => count += 1) (Math.sqrt) (S.Just (9)), 3);
  eq (count, 0);

});
