'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('apSecond', () => {

  eq (String (S.apSecond), 'apSecond :: Apply f => f a -> f b -> f b');

  eq (S.apSecond ([1, 2]) ([3, 4]), [3, 4, 3, 4]);
  eq (S.apSecond (S.Just (1)) (S.Just (2)), S.Just (2));

});
