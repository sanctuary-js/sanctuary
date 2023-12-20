'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('./internal/sanctuary');

const Sum = require ('./internal/Sum');


test ('invert', () => {

  eq (String (S.invert), 'invert :: Group g => g -> g');

  eq (S.invert (Sum (5)), Sum (-5));
  eq (S.invert (Sum (-5)), Sum (5));

});
