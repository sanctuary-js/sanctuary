'use strict';

const {deepStrictEqual: eq} = require ('assert');

const $ = require ('sanctuary-def');

const S = require ('..');

const Sum = require ('./internal/Sum');


test ('is', () => {

  eq (String (S.is), 'is :: Type -> Any -> Boolean');

  eq (S.is ($.Boolean) (true), true);
  eq (S.is ($.Boolean) (false), true);
  eq (S.is ($.Boolean) (new Boolean (true)), false);
  eq (S.is ($.Boolean) (new Boolean (false)), false);

  eq (S.is ($.Array ($.Integer)) (null), false);
  eq (S.is ($.Array ($.Integer)) (undefined), false);
  eq (S.is ($.Array ($.Integer)) (['1', '2', '3']), false);
  eq (S.is ($.Array ($.Integer)) ([1, 2, 3.14]), false);
  eq (S.is ($.Array ($.Integer)) ([1, 2, 3]), true);
  eq (S.is ($.Array ($.Integer)) ([]), true);

  eq (S.is ($.Maybe ($.Integer)) (S.Nothing), true);
  eq (S.is ($.Maybe ($.Integer)) (S.Just (0)), true);
  eq (S.is ($.Maybe ($.Integer)) (S.Left (0)), false);
  eq (S.is ($.Maybe ($.Integer)) (S.Right (0)), false);

  eq (S.is ($.Either ($.String) ($.Integer)) (S.Nothing), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Just (0)), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Left (0)), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Right ('')), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Left ('')), true);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Right (0)), true);

  const a = $.TypeVariable ('a');

  eq (S.is ($.Array (a)) ([]), true);
  eq (S.is ($.Array (a)) ([1, 2, 3]), true);
  eq (S.is ($.Array (a)) (['foo', 'bar', 'baz']), true);
  eq (S.is ($.Array (a)) (['foo', true, 42]), false);
  eq (S.is ($.Array (a)) ([Sum (1), Sum (2), Sum (3)]), false);

  eq ((S.create ({checkTypes: true, env: []})).is ($.Array (a)) ([]), false);
  eq ((S.create ({checkTypes: true, env: [$.String]})).is ($.Array (a)) ([]), true);
  eq ((S.create ({checkTypes: true, env: [$.String]})).is ($.Array (a)) ([1, 2, 3]), false);
  eq ((S.create ({checkTypes: true, env: [$.Number]})).is ($.Array (a)) ([1, 2, 3]), true);
  eq ((S.create ({checkTypes: true, env: [Sum.Type]})).is ($.Array (a)) ([Sum (1), Sum (2), Sum (3)]), true);

});
